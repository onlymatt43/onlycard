# ONLYMATT Card

**Plateforme de carte de visite numérique et collab booking pour créateurs**

Page de liens élégante avec floating meta cards, système de booking collab via Twitter OAuth, profils créateurs auto-générés, et matching automatique par destination.

## 🌐 Subdomains

| URL | Page | Description |
|-----|------|-------------|
| `me.onlymatt.ca` | `/` | Page principale — liens, grouped components, floating cards |
| `collabs.onlymatt.ca` | `/collabs` | Destinations avec cards, booked creators, matching |
| `book.onlymatt.ca` | `/book` | Formulaire de booking (Twitter OAuth required) |
| `me.onlymatt.ca/admin` | `/admin` | Panel admin — config, destinations, creators |
| `me.onlymatt.ca/creator/[username]` | `/creator/[username]` | Profil créateur auto-généré |

## 🎨 Features

- ✅ **Grouped Link Components** — PAY, SOCIAL, ADULT, CONNECT, AFFILIATES (hover expand + click-to-copy)
- ✅ **Floating Meta Cards** — Cards flottantes OG en temps réel
- ✅ **Photos Aléatoires** — Rotation dynamique depuis Bunny Storage
- ✅ **Collab Booking** — Formulaire avec Twitter OAuth, date pickers, adresse + maps, calendar sync
- ✅ **Creator Profiles** — Auto-générés depuis Twitter, claimable par le créateur
- ✅ **Creator Matching** — "Also going" — voit qui va à la même destination
- ✅ **Admin Panel** — Chat commands + UI visuel, gestion complète de la config
- ✅ **Dark Velvet Design** — Fond noir avec gradients emerald/cyan subtils

## 🚀 Stack

- **Framework**: Next.js 16.1.6 (App Router, TypeScript)
- **Styling**: Tailwind CSS 3.4
- **Auth**: next-auth@4 (Twitter OAuth 2.0)
- **Images**: Bunny CDN (`onlymatt-public-zone.b-cdn.net`)
- **Storage**: GitHub API (data/config.json, bookings.json, creators.json)
- **Deploy**: Vercel (auto-deploy from `master`)

## 🧩 Architecture

```
app/
  page.tsx                         — Page principale (me.onlymatt.ca)
  layout.tsx                       — Metadata OG globales
  globals.css                      — Styles + animations
  middleware.ts                    — Routing subdomains (collabs., book.)

  admin/page.tsx                   — Panel admin (config, destinations, creators)

  auth/login/page.tsx              — OAuth redirect page (me.onlymatt.ca)

  book/
    page.tsx                       — Formulaire booking (Twitter login required)
    layout.tsx                     — SessionProvider wrapper

  collabs/page.tsx                 — Destinations + creator matching

  creator/[username]/
    page.tsx                       — Profil créateur (claimable)
    layout.tsx                     — SessionProvider wrapper

  api/
    auth/[...nextauth]/route.ts    — NextAuth Twitter OAuth 2.0
    admin/config/route.ts          — CRUD config.json (admin protected)
    bookings/route.ts              — GET/POST bookings
    creators/route.ts              — GET all / POST create creator
    creators/[username]/route.ts   — GET/PUT single creator (claim, edit, delete)
    creators/fetch-twitter/route.ts — Lookup Twitter profile (admin)
    fetch-meta/route.ts            — Proxy OG metadata pour floating cards
    random-image/route.ts          — Rotation photo Bunny Storage

  components/
    RandomImage.tsx                — Avatar avec photo aléatoire
    FloatingMetaCards.tsx          — Cards flottantes OG (6 slots)
    CollabDestinations.tsx         — Client wrapper: bookings + creators → DestinationCard
    DestinationCard.tsx            — Destination card avec media bg + booked avatars
    Providers.tsx                  — SessionProvider wrapper
    PayOnlyMatt.tsx                — Groupe: PayPal, Wise
    SocialMedia.tsx                — Groupe: X, Instagram, Bluesky, TikTok, Facebook
    AdultContent.tsx               — Groupe: RawFuckClub, OnlyFans, PornHub, JustFor.Fans
    Connect.tsx                    — Groupe: WhatsApp x2, Telegram
    Affiliates.tsx                 — Groupe: Intimaly, JockTribe, Cockblock, Beisar, Amazon
    SocialIcon.tsx                 — Icônes SVG

data/
  config.json                      — Config centralisée (groups, links, destinations, collab types)
  bookings.json                    — Bookings (via GitHub API)
  creators.json                    — Creator profiles (via GitHub API)
```

## 🔐 Auth Flow

1. User va sur `book.onlymatt.ca`
2. Redirigé vers `me.onlymatt.ca/auth/login` (domaine enregistré sur Twitter)
3. Twitter OAuth 2.0 → callback sur `me.onlymatt.ca`
4. Session cookie sur `.onlymatt.ca` (cross-subdomain)
5. Redirect back vers `book.onlymatt.ca`

## 👤 Creator Profiles

- **Admin**: ajoute un créateur via `@username` ou URL Twitter → fetch auto avatar/bio
- **Booking**: profil auto-créé quand quelqu'un book une collab
- **Claim**: le créateur visite `/creator/username`, se connecte via Twitter, claim son profil
- **Edit**: bio + links éditables une fois claimed
- **Matching**: section "Also going" sur chaque booking — cross-reference par ville

## ⚙️ Variables d'Environnement

```bash
# Bunny Storage — rotation d'images
BUNNY_STORAGE_API_KEY=your-bunny-storage-api-key
BUNNY_STORAGE_ZONE=onlymatt-public
BUNNY_PHOTOS_FOLDER=card

# Admin Panel
ADMIN_PASSWORD=your-admin-password

# GitHub API — storage (config, bookings, creators)
GITHUB_TOKEN=your-github-personal-access-token
GITHUB_OWNER=onlymatt43
GITHUB_REPO=onlycard

# Twitter OAuth 2.0
TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://me.onlymatt.ca
```

## 📦 Installation

```bash
npm install
cp .env.example .env.local  # Remplir les variables
npm run dev
```

## 🔄 Workflow

- Branch: `master`
- Auto-deploy sur Vercel à chaque push
- `npm run build` avant chaque commit

À chaque visite, une photo différente s'affiche! 🎲

### Développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 🌐 Production

- **URL**: https://me.onlymatt.ca
- **Deploy**: Vercel (auto-deploy from `master` branch)
- **Repository**: https://github.com/onlymatt43/onlycard

## �️ Gestion locale des familles de liens

Pour composer rapidement des « familles » ou des menus personnalisés hors ligne, un petit outil est fourni dans
le workspace :

```
links.html
```

### utilisation

1. Ouvre le fichier `links.html` dans ton navigateur (double clic suffit).
2. Pour ajouter un lien **personnalisé**, saisis un titre et une URL dans les champs en haut, puis clique
   sur **Ajouter**. Le lien apparaît dans la grille avec une case à cocher.
3. Coche autant de liens que tu veux regrouper, choisis un nom de groupe dans le champ ci‑dessous et clique
   sur **Créer le groupe**. Le JSON représentant les groupes est affiché dans le bloc gris.
4. Tu peux créer plusieurs groupes successivement. Un même lien peut appartenir à plusieurs groupes.
5. Lorsque tu as fini, utilise **Exporter JSON** pour télécharger un fichier `groups.json` (ou `groups-2.json`,
   etc.) contenant toutes les familles que tu viens de définir.
6. Ces fichiers peuvent ensuite servir de base pour générer des menus, les importer dans WordPress
   ou les transformer en mode `?mode=` pour l’iframe.

### format

Chaque fichier exporté est un objet JSON dont les clés sont les noms de groupe et les valeurs des tableaux de
liens :

```json
{
  "social-media": [
    { "title": "INSTAGRAM", "url": "https://..." },
    ...
  ],
  "payment": [
    { "title": "PAYPAL", "url": "..." },
    ...
  ]
}
```

Tu peux renommer, fusionner ou créer de nouvelles familles en modifiant ces fichiers ou en réexécutant l’outil.

## �📌 Iframe integration example

Use the same UI inside an iframe and swap links dynamically via query parameter:

```html
<iframe
  src="https://me.onlymatt.ca/?mode=menu"
  class="w-full h-full"
  style="border:0"
></iframe>
```

- `?mode=menu` or `?mode=popup` selects a different set of links.
- optionally append `&video=https://…` to override the background video.

You can also send messages from parent using `postMessage` to update links after load.

## 📝 Metadata Optimisées

Le site génère automatiquement des cartes de prévisualisation optimisées pour :
- WhatsApp, Telegram, iMessage
- LinkedIn, Twitter/X, Facebook
- Discord, Slack
- Gmail, Outlook

Le site WordPress **onlymatt.ca** utilise **Rank Math SEO** pour générer les OG tags des pages (collabs, events, etc.).

## 📸 Image Open Graph

Image hébergée sur Bunny CDN :
- `https://onlymatt-public-zone.b-cdn.net/card/solo-pics14728a1b-b8ad-41b0-beac-e8f6b24202a8.JPEG`
- Dimensions: 1200x630 (recommandé Open Graph)

## 🔗 Liens actifs (main list)

Seul YOUTUBE reste dans la liste principale. Tous les autres liens sont dans des grouped components :
- **PAY ONLYMATT** : PayPal, Wise
- **SOCIAL MEDIA** : X/Twitter, Instagram, Instagram PRO, Bluesky, TikTok, Facebook
- **ADULT CONTENT** : RawFuckClub, OnlyFans, OnlyFans PRO, PornHub, JustFor.Fans
- **CONNECT** : WhatsApp, WhatsApp 2, Telegram
- **AFFILIATES** : Intimaly, JockTribe, Cockblock, Beisar, Amazon

## 📄 License

© 2026 OM43 Digital - Mathieu Courchesne
