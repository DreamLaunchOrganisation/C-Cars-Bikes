# Cars & Bikes — site vitrine

Site de l'atelier auto & moto **Cars & Bikes** (Trazegnies), en **Next.js 16** (App Router, TypeScript, CSS Modules), déployé sur **Vercel**.

## Démarrer en local

```bash
npm install
cp .env.example .env.local   # facultatif en local
npm run dev                  # http://localhost:3000
```

En local, si `SMTP_HOST` est vide dans `.env.local`, le formulaire de contact n'envoie rien : le message s'affiche dans le terminal.

Autres commandes :

| Commande        | Rôle                                        |
| --------------- | ------------------------------------------- |
| `npm run build` | Build de production (à lancer avant de pousser) |
| `npm run start` | Sert le build de production en local        |
| `npm run lint`  | Vérifie le code (ESLint)                    |

## Organisation

```
src/
├─ app/                      Routes et fichiers spéciaux Next.js
│  ├─ layout.tsx             Gabarit commun (polices, SEO, en-tête, pied de page)
│  ├─ page.tsx               Page d'accueil (assemble les sections)
│  ├─ globals.css            Couleurs, base et utilitaires partagés
│  ├─ fonts.ts               Polices (next/font, auto-hébergées)
│  ├─ icon.png               Favicon (logo)
│  ├─ sitemap.ts, robots.ts  Référencement
│  └─ not-found.tsx          Page 404
├─ actions/contact.ts        Server Action : envoi du formulaire
├─ components/
│  ├─ layout/                Header, Footer, Logo
│  ├─ sections/              Une section = un dossier (composant + CSS Module)
│  │  ├─ hero/               Titre + animation du mécanicien (blueprint-scenes.ts = le dessin)
│  │  ├─ services/  about/  sales/  reviews/  marquee/
│  │  ├─ clients/            Galerie (carrousel + plein écran)
│  │  └─ contact/            Formulaire, horaires, coordonnées, carte
│  ├─ seo/                   Données structurées Google (fiche garage)
│  └─ ui/                    Petits composants réutilisables (Icon, Reveal, SectionHeading…)
├─ data/                     ✏️ Contenu du site : c'est ici qu'on modifie les textes
│  ├─ site.ts                Coordonnées, horaires, menu
│  ├─ services.ts            Services + bande défilante
│  ├─ sales.ts               Catégories « Vente »
│  └─ gallery.ts             Photos « Nos clients »
├─ lib/                      Logique : horaires, validation du formulaire, envoi des mails
└─ assets/                   Logo, photos clients, polices
```

Les composants sont des **Server Components** par défaut ; seuls ceux qui ont besoin d'interactivité sont marqués `"use client"` (Header, Gallery, ContactForm, OpeningHours, Reveal). La page est **entièrement statique** (servie par le CDN de Vercel) ; seul l'envoi du formulaire s'exécute côté serveur.

### Modifier le contenu

- **Téléphone, adresse, horaires** → `src/data/site.ts`
- **Ajouter une photo client** → déposer le `.jpg` dans `src/assets/clients/`, puis l'importer et l'ajouter dans `src/data/gallery.ts`
- **Services** → `src/data/services.ts`

## Formulaire de contact

Le formulaire envoie un e-mail à l'atelier via le **SMTP de la boîte One.com** (`info@carbike.be`) — pas besoin d'un service payant en plus. Validation côté serveur (Zod), champ piège anti-robots, pièce jointe facultative (photo ou PDF, **4 Mo max** : Vercel refuse les requêtes de plus de 4,5 Mo).

Variables d'environnement (voir `.env.example`) :

| Variable     | Valeur                                    |
| ------------ | ----------------------------------------- |
| `SMTP_HOST`  | `send.one.com`                            |
| `SMTP_PORT`  | `587`                                     |
| `SMTP_USER`  | `info@carbike.be`                         |
| `SMTP_PASS`  | mot de passe de la boîte mail             |
| `CONTACT_TO` | adresse qui reçoit les messages           |

## Déploiement sur Vercel

1. Pousser le projet sur GitHub, puis **Add New → Project** sur Vercel et importer le dépôt (Next.js est détecté automatiquement).
2. **Settings → Environment Variables** : ajouter les 5 variables ci-dessus.
3. **Settings → Domains** : ajouter `carbike.be` et `www.carbike.be`.
4. Dans l'espace **One.com → DNS** : créer/modifier l'enregistrement **A** de `carbike.be` et le **CNAME** `www` avec les valeurs affichées par Vercel.
   ⚠️ Ne pas toucher aux enregistrements **MX / SPF / DKIM** : ce sont eux qui font fonctionner les e-mails.
5. Tester le formulaire en ligne (avec une photo jointe) et vérifier la réception sur `info@carbike.be`.

## À faire ensuite

- Pages de détail « Vente » (`/vente/autos`, …) : pour l'instant les cartes renvoient vers le formulaire de contact.
- Lien « Lire les avis clients » : remplacer l'URL dans `src/components/sections/reviews/Reviews.tsx` par la fiche Google de l'atelier.
