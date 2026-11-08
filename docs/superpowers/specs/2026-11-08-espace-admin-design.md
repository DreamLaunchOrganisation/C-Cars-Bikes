# Espace d'administration C/Cars & Bikes — conception

Date : 2026-11-08 · Projet : `carbike` (Next.js 16.4, App Router, `cacheComponents: true`, déployé sur Vercel)

## 1. Intention

Le site vitrine est terminé. Le gérant (un seul utilisateur, non technique) doit pouvoir faire lui-même les mises à jour courantes, sans passer par l'agence ni par un redéploiement :

- ajouter / retirer des logos dans le bandeau jaune défilant (marques partenaires) ;
- ajouter / retirer / réordonner les photos de la section « Nos clients » ;
- ajouter / retirer / réordonner des annonces (photo + description) dans la section « Vente » ;
- modifier son téléphone, son e-mail et ses horaires d'ouverture.

Il n'y a pas de base de données et on ne veut pas en ajouter une.

## 2. Objectifs, non-objectifs, anti-objectifs

**Objectifs**
- Une page `/admin` simple, utilisable sur ordinateur **et sur téléphone** (il prendra souvent les photos avec son téléphone).
- Une modification enregistrée est visible sur le site public immédiatement (pas de redéploiement, pas d'attente de plusieurs minutes).
- Au premier lancement, le contenu actuel (36 logos, 6 photos clients, coordonnées, horaires) est déjà présent : il ne repart pas de zéro.

**Non-objectifs**
- Plusieurs comptes, rôles, inscription, mot de passe oublié par e-mail.
- Éditer les autres textes du site (services, à propos, titres…).
- Historique / annulation des modifications.
- Pages de détail par annonce (`/vente/[slug]`).
- Modifier les 3 photos du diaporama d'accueil (non demandé ; restent dans `src/assets/hero/`).
- Prix ou champs structurés dans les annonces : le prix éventuel s'écrit dans la description.

**Anti-objectifs (ce qui serait un échec même si « ça marche »)**
- Le site public devient lent ou perd son rendu statique parce qu'il lit le contenu à chaque requête.
- Une photo prise au téléphone (5–12 Mo) échoue à l'envoi.
- Une personne non connectée peut modifier quoi que ce soit (vérification côté serveur dans **chaque** action, pas seulement dans l'interface).
- Le gérant casse le site en saisissant une valeur invalide (horaire impossible, champ vide…).

## 3. Contraintes

- Next.js 16 avec Cache Components : lire `node_modules/next/dist/docs/` avant d'écrire du code (cf. `AGENTS.md`). Points clés vérifiés :
  - lecture du contenu dans une fonction `'use cache'` + `cacheTag('site-content')` + `cacheLife('max')` → reste dans le rendu statique ;
  - après une écriture, `updateTag('site-content')` dans la Server Action → le gérant voit son changement tout de suite ;
  - lire `cookies()` (session) doit se faire derrière un `<Suspense>` ; jamais dans une fonction `'use cache'` ;
  - `middleware` s'appelle désormais `proxy` (`proxy.ts`).
- Vercel : système de fichiers non persistant → rien ne peut être écrit sur disque. Corps des requêtes limité à 4,5 Mo.
- Une seule nouvelle dépendance prévue : `@vercel/blob`. Pas de bibliothèque d'authentification (Node `crypto` suffit).

## 4. Décisions prises avec l'utilisateur

1. **Connexion** : mot de passe unique défini dans les variables d'environnement Vercel. Session dans un cookie signé.
2. **Stockage** : Vercel Blob pour les images **et** pour un fichier de contenu JSON.
3. **Vente** : chaque annonce = une photo + une description.

## 5. Architecture

### 5.1 Authentification

Variables d'environnement :

| Variable | Rôle |
| --- | --- |
| `ADMIN_PASSWORD_HASH` | Empreinte scrypt du mot de passe (format `scrypt$<sel>$<hash>` en base64). Jamais le mot de passe en clair. |
| `SESSION_SECRET` | Clé (≥ 32 octets aléatoires) pour signer le cookie de session (HMAC-SHA256). |
| `BLOB_READ_WRITE_TOKEN` | Ajoutée automatiquement par Vercel quand on relie un store Blob au projet. |

- Fournir un script `npm run admin:hash -- "<mot de passe>"` qui affiche la valeur à coller dans `ADMIN_PASSWORD_HASH`, et un mot dans le README sur la génération de `SESSION_SECRET`.
- Connexion : formulaire `/admin/login` → Server Action → comparaison scrypt en temps constant → cookie `cb_admin` (`httpOnly`, `secure`, `sameSite=lax`, `path=/`, durée 30 jours) contenant `{ exp }` signé.
- Limiter les tentatives : délai fixe (~1 s) après un échec suffit (pas de base pour compter les essais).
- `proxy.ts` : redirige `/admin/*` (sauf `/admin/login`) vers `/admin/login` si le cookie est absent ou invalide. **C'est un confort, pas la sécurité** : chaque Server Action et chaque Route Handler d'administration revérifie la session elle-même (`requireAdmin()` dans `src/lib/admin/session.ts`, `import 'server-only'`).
- Déconnexion : bouton qui supprime le cookie.
- `/admin` exclu de l'indexation (`robots.ts` + `noindex` dans les métadonnées).

### 5.2 Contenu (modèle de données)

Un seul document `content.json` dans Blob, validé par un schéma `zod` à la lecture et à l'écriture :

```ts
type Img = { src: string; width: number; height: number; blurDataURL?: string };

type SiteContent = {
  version: 1;
  partners: { id: string; name: string; logo: Img }[];                       // ordre = ordre d'affichage
  clients: { id: string; title: string; category: "Motos" | "Autos"; image: Img }[];
  sales: { id: string; category: "autos" | "motos" | "pieces" | "divers"; description: string; image: Img }[];
  contact: { phoneDisplay: string; email: string };                          // href et format international dérivés
  openingHours: { day: number; slots: { from: number; to: number }[] }[];    // 0 = dimanche … 6 = samedi, minutes
};
```

- **Contenu par défaut** (`src/data/default-content.ts`) : construit à partir des données actuelles (`partners.ts`, `gallery.ts`, `site.ts`). Les images par défaut restent des imports statiques du dépôt ; on stocke leur `src/width/height/blurDataURL`. Utilisé tant qu'aucun `content.json` n'existe (premier lancement, ou développement local sans jeton Blob).
- **Lecture** : `getContent()` dans `src/lib/content.ts` (`'use cache'`, `cacheTag('site-content')`, `cacheLife('max')`). Si Blob est vide ou le JSON invalide → contenu par défaut (et log d'erreur), jamais de page cassée.
- **Écriture** : `saveContent(next)` valide, écrit dans Blob, puis `updateTag('site-content')`. Un seul administrateur : pas de gestion de conflit au-delà d'un contrôle simple (voir 8). La toute première écriture part du contenu par défaut (on le recopie dans Blob avec la modification appliquée).
- **Descriptions de vente** : texte brut ; les retours à la ligne sont conservés à l'affichage (`white-space: pre-line`), aucun HTML ni Markdown interprété.
- ⚠️ Les fichiers Blob publics sont servis via un CDN avec un cache long : pour `content.json`, soit écrire avec `cacheControlMaxAge: 0` et lire avec `cache: 'no-store'`, soit versionner le nom (`content/<horodatage>.json` + `list()` pour prendre le plus récent et supprimer les anciens). Le constructeur choisit et le vérifie.
- **Champs dérivés** : le lien `tel:` et le format international (`+32 …`) sont calculés à partir du numéro saisi (numéros belges). L'adresse reste dans `site.ts` (non éditable).

### 5.3 Images

- **Envoi direct du navigateur vers Blob** (`@vercel/blob/client` `upload()` + Route Handler `handleUpload` qui appelle `requireAdmin()` avant de délivrer le jeton). Contourne la limite de 4,5 Mo.
- **Redimensionnement dans le navigateur avant l'envoi** : côté le plus long ≤ 2000 px pour les photos (≤ 600 px pour les logos), JPEG/WebP qualité ~0,85 ; on récupère largeur/hauteur à ce moment-là. Formats acceptés : JPEG, PNG, WebP, HEIC si le navigateur sait le décoder (sinon message clair).
- Logos : PNG/WebP uniquement (pas de SVG, pour éviter tout contenu actif) ; pas de détourage automatique (le gérant envoie un logo à fond transparent ; l'interface affiche un aperçu sur fond jaune pour qu'il voie le rendu).
- `next.config.ts` : `images.remotePatterns` pour `*.public.blob.vercel-storage.com`.
- Supprimer un élément supprime aussi son image dans Blob (sauf images par défaut du dépôt).

### 5.4 Interface d'administration (`/admin`)

Une seule page, quatre onglets : **Bandeau**, **Nos clients**, **Vente**, **Coordonnées**. En français, gros boutons, pensée pour le téléphone.

- **Listes (Bandeau, Nos clients, Vente)** : vignettes en grille ; « Ajouter » ouvre le sélecteur de fichier (ou l'appareil photo sur mobile) ; chaque vignette a un bouton Supprimer (avec confirmation) et des flèches ↑/↓ (ou ←/→) pour réordonner. Le glisser-déposer est un bonus, pas un prérequis : les flèches doivent marcher au doigt.
  - Bandeau : nom de la marque (sert au texte alternatif) + logo.
  - Nos clients : titre + catégorie Motos/Autos + photo ; l'ordre est géré par catégorie.
  - Vente : catégorie (Autos/Motos/Pièces/Divers) + description (texte multi-ligne, ≤ 500 caractères) + photo ; éditer la description d'une annonce existante doit être possible.
- **Coordonnées** : téléphone, e-mail, horaires (pour chaque jour : « Fermé » ou 1 à 2 plages « de – à », sélecteurs au quart d'heure). Validation : fin > début, plages qui ne se chevauchent pas, e-mail valide, numéro valide.
- Chaque modification est enregistrée immédiatement (ajout, suppression, déplacement) ; Coordonnées a un bouton « Enregistrer ». Message de confirmation / d'erreur visible.
- Lien « Voir le site » et bouton « Se déconnecter ».

### 5.5 Site public

Les composants qui lisent aujourd'hui des données figées passent à `getContent()` :

| Zone | Aujourd'hui | Après |
| --- | --- | --- |
| Bandeau jaune (`Marquee`) | `src/data/partners.ts` | `content.partners` |
| Nos clients (`Clients`/`Gallery`) | `src/data/gallery.ts` | `content.clients` |
| Vente (`Sales`) | 4 cartes de catégories fixes | voir ci-dessous |
| Coordonnées, pied de page, JSON-LD, message d'erreur du formulaire | `site.phone`, `site.email` | `content.contact` |
| Horaires (`OpeningHours`, `lib/hours.ts`, JSON-LD) | `openingHours` | `content.openingHours` |

**Vente — mise en page (choix de l'agent, à valider)** : on garde les 4 catégories mais elles deviennent des onglets de filtre (comme Motos/Autos dans « Nos clients »), avec un onglet « Tout » par défaut. Dessous, une grille de cartes : photo + description (tronquée à ~4 lignes, cliquer ouvre la photo en grand avec la description complète). Si aucune annonce : un encart « Rien en vente pour le moment — contactez-nous » avec un lien vers le formulaire. Les onglets sans annonce sont masqués.

## 6. Choix faits par l'agent (à vérifier à la relecture)

1. Le bandeau est aussi réordonnable (même mécanisme que les photos).
2. Nos clients garde les catégories Motos/Autos et un titre par photo.
3. L'adresse n'est pas éditable.
4. Le formulaire de contact envoie les messages à l'**e-mail saisi dans l'admin** (la variable `CONTACT_TO` reste prioritaire si elle est définie, pour pouvoir forcer une autre adresse).
5. Mise en page de la Vente décrite en 5.5.
6. Session de 30 jours.
7. Pas de détourage automatique des logos envoyés.

## 7. Laissé au constructeur

- Structure exacte des fichiers et des composants de l'admin, styles (cohérents avec le site : sombre, jaune, rouge).
- Stratégie anti-cache CDN pour `content.json` (5.2), à vérifier en conditions réelles.
- Méthode de redimensionnement (canvas / `createImageBitmap`) et format de sortie.
- Génération des `id` (`crypto.randomUUID()`).
- Tests : au minimum, tests unitaires du schéma, des validations d'horaires, du hachage/vérification du mot de passe et de la signature de session ; vérification manuelle du parcours complet sur un déploiement de prévisualisation Vercel.

## 8. Risques et points d'attention

- **Écritures concurrentes** (deux onglets ouverts) : la dernière écriture gagne. Acceptable pour un seul utilisateur ; chaque action relit le contenu juste avant d'écrire et n'applique que sa propre modification (ajout/suppression/déplacement d'un élément), plutôt que de renvoyer tout le document depuis le navigateur.
- **Développement local** : sans `BLOB_READ_WRITE_TOKEN`, l'admin s'affiche mais les écritures renvoient un message explicite ; le site public utilise le contenu par défaut.
- **Coûts / plan Vercel** : le volume de ce site tient dans les quotas gratuits de Blob. Attention toutefois : le plan Vercel « Hobby » est réservé à un usage non commercial ; le site d'un garage relève en principe d'un plan Pro (ou d'un projet hébergé sur le compte Pro de l'agence). À vérifier avant la mise en ligne — sans impact sur le code.
- **Mise en place** (à documenter dans le README) : créer le store Blob dans Vercel et le relier au projet, définir `ADMIN_PASSWORD_HASH` et `SESSION_SECRET`, redéployer une fois.
