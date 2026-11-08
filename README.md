# C/Cars & Bikes — site vitrine

Site de l'atelier auto & moto **C/Cars & Bikes** (Trazegnies), en **Next.js 16** (App Router, TypeScript, CSS Modules), déployé sur **Vercel**. Le gérant met à jour lui-même une partie du contenu depuis un **espace d'administration** (`/admin`).

## Démarrer en local

```bash
npm install
cp .env.example .env.local   # puis compléter (voir plus bas)
npm run dev                  # http://localhost:3000
```

En local, si `SMTP_HOST` est vide dans `.env.local`, le formulaire de contact n'envoie rien : le message s'affiche dans le terminal.

| Commande                          | Rôle                                                  |
| --------------------------------- | ----------------------------------------------------- |
| `npm run build`                   | Build de production (à lancer avant de pousser)       |
| `npm run start`                   | Sert le build de production en local                  |
| `npm run lint`                    | Vérifie le code (ESLint)                              |
| `npm test`                        | Tests automatiques (Vitest)                           |
| `npm run admin:hash -- "mot de passe"` | Génère la valeur de `ADMIN_PASSWORD_HASH`        |

> Le chemin du dossier contient un `&` (`Cars&Bikes`), ce qui peut casser les raccourcis `npx …` sous Windows : `npm test` et `npm run admin:hash` appellent donc leurs outils avec `node` directement. En cas de souci avec une autre commande, l'équivalent direct est `node node_modules/next/dist/bin/next build` (ou `dev`, `start`).

## Organisation

```
src/
├─ app/
│  ├─ layout.tsx             Gabarit racine (polices, SEO)
│  ├─ (site)/                Site public : layout (en-tête, pied de page) + page d'accueil
│  ├─ admin/                 Espace d'administration (connexion + tableau de bord)
│  ├─ api/admin/upload/      Autorise l'envoi d'images vers Vercel Blob (admin connecté)
│  ├─ globals.css, fonts.ts, icon.png, sitemap.ts, robots.ts, not-found.tsx
├─ proxy.ts                  Renvoie /admin vers la page de connexion sans session
├─ actions/                  Server Actions : formulaire de contact, connexion, modifications de l'admin
├─ components/
│  ├─ layout/                Header, Footer
│  ├─ sections/              Une section = un dossier (composant + CSS Module)
│  │  ├─ hero/               Logo animé (logo-geometry.ts, logo-lettering.ts) + diaporama
│  │  ├─ marquee/            Bandeau jaune des marques partenaires
│  │  ├─ clients/  sales/    Galerie « Nos clients », annonces « Vente »
│  │  └─ contact/            Formulaire, horaires, coordonnées, carte
│  ├─ admin/                 Interface de l'espace d'administration
│  ├─ seo/                   Données structurées Google (fiche garage)
│  └─ ui/                    Petits composants réutilisables
├─ data/                     Textes fixes : site.ts (nom, adresse, menu), services.ts, sales.ts (catégories)
├─ lib/
│  ├─ content/               Contenu modifiable : schéma, contenu par défaut, lecture/écriture Blob
│  ├─ admin/                 Mot de passe, session, contrôle des URL d'images
│  └─ …                      Horaires, validation du formulaire, envoi des mails
└─ assets/                   Titre, logo, photos, logos partenaires, polices
```

La page d'accueil reste **statique** (servie par le CDN de Vercel) : le contenu modifiable est mis en cache et rafraîchi automatiquement à chaque modification depuis l'admin.

## Modifier le contenu

**Depuis l'espace d'administration** (`https://carbike.be/admin`) :

- **Bandeau jaune** : ajouter, retirer, réordonner les logos partenaires (PNG/WebP détourés) ;
- **Nos clients** : ajouter, retirer, réordonner les photos (onglets Motos / Autos) ;
- **Vente** : publier, modifier, retirer, réordonner les annonces (photo + description) ;
- **Coordonnées** : téléphone, e-mail (qui reçoit aussi les messages du formulaire) et horaires.

Les photos sont réduites dans le navigateur avant l'envoi : une photo prise au téléphone passe sans problème.

**Dans le code** : adresse, textes des sections, services → `src/data/` et les composants de `src/components/sections/`.

## Espace d'administration — mise en place

Le contenu modifiable (`content.json`) et les images envoyées sont stockés dans **Vercel Blob** (pas de base de données). Tant qu'aucune modification n'a été enregistrée, le site affiche le contenu par défaut (`src/lib/content/defaults.ts`).

1. **Vercel → Storage → Create → Blob**, puis relier le store au projet : la variable `BLOB_READ_WRITE_TOKEN` est ajoutée automatiquement.
2. **Settings → Environment Variables** : ajouter
   - `ADMIN_PASSWORD_HASH` : sortie de `npm run admin:hash -- "mot de passe du gérant"` (10 caractères minimum) ;
   - `SESSION_SECRET` : sortie de `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`.
3. Redéployer, puis se connecter sur `/admin`.

Changer le mot de passe = remplacer `ADMIN_PASSWORD_HASH` puis redéployer. Changer `SESSION_SECRET` déconnecte toutes les sessions.

**Tester en local** : `npx vercel link` puis `npx vercel env pull .env.local` récupère le jeton Blob ; ajouter `ADMIN_PASSWORD_HASH` et `SESSION_SECRET` dans `.env.local`. Pour ne pas toucher au contenu en ligne, utiliser de préférence un **second store Blob** réservé aux tests. Sans jeton Blob, l'admin s'affiche mais refuse d'enregistrer (message explicite).

> **Plan Vercel** : le plan gratuit « Hobby » est réservé à un usage non commercial ; le site d'un garage relève d'un plan Pro (ou du compte Pro de l'agence).

## Formulaire de contact

Le formulaire envoie un e-mail à l'atelier via le **SMTP de la boîte One.com** — pas besoin d'un service payant en plus. Validation côté serveur (Zod), champ piège anti-robots, pièce jointe facultative (photo ou PDF, **4 Mo max** : Vercel refuse les requêtes de plus de 4,5 Mo).

| Variable     | Valeur                                                                      |
| ------------ | --------------------------------------------------------------------------- |
| `SMTP_HOST`  | `send.one.com`                                                              |
| `SMTP_PORT`  | `587`                                                                       |
| `SMTP_USER`  | `info@carbike.be` (boîte qui envoie)                                        |
| `SMTP_PASS`  | mot de passe de la boîte mail                                               |
| `CONTACT_TO` | facultatif : force le destinataire (sinon, l'e-mail saisi dans l'admin)     |

## Déploiement sur Vercel

1. Pousser le projet sur GitHub, puis **Add New → Project** sur Vercel et importer le dépôt (Next.js est détecté automatiquement).
2. **Settings → Environment Variables** : ajouter les variables SMTP et celles de l'admin (voir ci-dessus), et relier le store Blob.
3. **Settings → Domains** : ajouter `carbike.be` et `www.carbike.be`.
4. Dans l'espace **One.com → DNS** : créer/modifier l'enregistrement **A** de `carbike.be` et le **CNAME** `www` avec les valeurs affichées par Vercel.
   ⚠️ Ne pas toucher aux enregistrements **MX / SPF / DKIM** : ce sont eux qui font fonctionner les e-mails.
5. Tester le formulaire en ligne (avec une photo jointe) et vérifier la réception, puis tester l'admin depuis un téléphone (ajout d'une photo).

## À faire ensuite

- Lien « Lire les avis clients » : remplacer l'URL dans `src/components/sections/reviews/Reviews.tsx` par la fiche Google de l'atelier.
