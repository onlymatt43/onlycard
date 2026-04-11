# ONLYMATT Card - Instructions Copilot

## 📇 Projet

Plateforme de carte de visite numérique et collab booking pour créateurs. Grouped link components, floating OG meta cards, Twitter OAuth booking, creator profiles auto-générés, et matching par destination.

## 🎯 Objectif

Page de liens élégante avec composants groupés interactifs (hover expand + click-to-copy), floating OG meta cards, système de booking collab via Twitter OAuth, profils créateurs auto-générés et claimable, matching automatique par destination.

## 🛠️ Stack

- **Framework**: Next.js 16.1.6 (App Router, TypeScript)
- **Styling**: Tailwind CSS 3.4
- **Auth**: next-auth@4 (Twitter OAuth 2.0, cookies sur .onlymatt.ca)
- **Images**: Bunny CDN (`onlymatt-public-zone.b-cdn.net`) + Bunny Storage (random rotation)
- **Storage**: GitHub API (data/config.json, bookings.json, creators.json)
- **SEO**: Rank Math plugin sur WordPress (onlymatt.ca) pour OG tags
- **Deploy**: Vercel (https://me.onlymatt.ca)
- **WordPress**: onlymatt.ca sur Hostinger avec Breakdance builder

## 🌐 Subdomains

- `me.onlymatt.ca` → `/` (page principale) + `/admin` + `/auth/login` + `/creator/[username]`
- `collabs.onlymatt.ca` → `/collabs` (destinations + creator matching)
- `book.onlymatt.ca` → `/book` (formulaire booking, Twitter OAuth required)
- Routing via `middleware.ts` (rewrite subdomains → routes)

## 📸 Random Image Rotation

Le système pioche aléatoirement dans un folder Bunny Storage (`onlymatt-public/card/`) pour afficher une photo différente à chaque visite.

**API Route**: `/api/random-image` (dynamic)
**Component**: `RandomImage.tsx` (client-side fetch)

## 🧩 Grouped Components

5 composants groupés dans `app/components/`, même pattern :
- **PayOnlyMatt.tsx** — PayPal, Wise
- **SocialMedia.tsx** — X/Twitter, Instagram, Instagram PRO, Bluesky, TikTok, Facebook
- **AdultContent.tsx** — RawFuckClub, OnlyFans, OnlyFans PRO, PornHub, JustFor.Fans
- **Connect.tsx** — WhatsApp, WhatsApp 2, Telegram
- **Affiliates.tsx** — Intimaly, JockTribe, Cockblock, Beisar, Amazon

Pattern: hover expand sub-links, click copies all URLs to clipboard.

## 🃏 Floating Meta Cards

`FloatingMetaCards.tsx` affiche jusqu'à 6 cards OG flottantes. URLs configurées dans `tempLinks` de `page.tsx`.
API proxy `/api/fetch-meta` scrape les OG tags. Overrides hardcodés pour OnlyFans et JustFor.Fans.

## 📅 Booking System

- Twitter OAuth 2.0 login required (via me.onlymatt.ca/auth/login)
- Formulaire: nom, type, dates (from/to pickers), adresse + Open in Maps, message
- Submit: sauvegarde dans data/bookings.json + ouvre WhatsApp/Telegram
- Confirmation: floating card preview + calendar sync (.ics + Google Calendar)
- Auto-crée un profil créateur à chaque booking

## 👤 Creator Profiles

- **Admin**: ajoute via @username ou URL Twitter → fetch auto avatar/bio/name
- **Booking**: profil auto-créé à chaque réservation
- **Claim**: créateur visite /creator/username → se connecte → claim
- **Edit**: bio + links éditables une fois claimed
- **Matching**: section "Also going" — cross-reference des bookings par ville
- **Storage**: data/creators.json via GitHub API

## 🔐 Auth

- NextAuth 4 avec Twitter OAuth 2.0
- Cookies sur `.onlymatt.ca` (cross-subdomain)
- Session: username, image, id depuis Twitter profile
- Redirect callback: autorise `*.onlymatt.ca`

## 🎨 Design

- **Dark velvet** — fond noir avec gradients radials emerald/cyan subtils
- Typographie soignée (tracking, uppercase)
- Gradient text (slate → cyan → emerald)
- Hover effects subtils
- Pas d'animations complexes

## 🚫 Règles Importantes

### Ne PAS modifier sans confirmation :
- Les URLs dans les grouped components (PayOnlyMatt, SocialMedia, etc.)
- Les URLs Bunny CDN et Storage
- Les metadata Open Graph (app/layout.tsx)
- Le design dark velvet (gradients, couleurs)
- L'API route random-image (app/api/random-image/route.ts)
- L'API route fetch-meta (app/api/fetch-meta/route.ts)
- Les `tempLinks` dans page.tsx (floating cards)
- Les credentials Twitter OAuth / NextAuth config

### Toujours vérifier :
- Build local (`npm run build`) avant commit
- Types TypeScript valides
- Open Graph metadata à jour

## 📝 Architecture

### Pages
- Page principale: `/` (app/page.tsx)
- Collabs: `/collabs` (app/collabs/page.tsx)
- Booking: `/book` (app/book/page.tsx)
- Admin: `/admin` (app/admin/page.tsx)
- Creator: `/creator/[username]` (app/creator/[username]/page.tsx)
- Auth login: `/auth/login` (app/auth/login/page.tsx)

### API Routes
- `/api/auth/[...nextauth]` — Twitter OAuth
- `/api/admin/config` — CRUD config.json (admin protected)
- `/api/bookings` — GET/POST bookings
- `/api/creators` — GET all / POST create creator
- `/api/creators/[username]` — GET/PUT single creator
- `/api/creators/fetch-twitter` — Lookup Twitter profile (admin)
- `/api/fetch-meta` — Proxy OG metadata
- `/api/random-image` — Rotation photo Bunny Storage

### Data (GitHub API storage)
- `data/config.json` — Config centralisée (groups, links, destinations, collab types, floating cards)
- `data/bookings.json` — Bookings
- `data/creators.json` — Creator profiles

## 🔄 Workflow Git

- Branch: `master`
- Auto-deploy sur Vercel à chaque push
- Pas de branches feature (projet simple)

## 📦 Dépendances

Minimales :
- next, react, react-dom (runtime)
- next-auth (auth)
- tailwindcss (styling)
- typescript (types)

## ⚙️ Variables d'Environnement

```
BUNNY_STORAGE_API_KEY    — Rotation d'images (obligatoire)
BUNNY_STORAGE_ZONE       — default: onlymatt-public
BUNNY_PHOTOS_FOLDER      — default: card
ADMIN_PASSWORD           — Admin panel
GITHUB_TOKEN             — GitHub API storage
GITHUB_OWNER             — default: onlymatt43
GITHUB_REPO              — default: onlycard
TWITTER_CLIENT_ID        — Twitter OAuth 2.0
TWITTER_CLIENT_SECRET    — Twitter OAuth 2.0
NEXTAUTH_SECRET          — NextAuth session encryption
NEXTAUTH_URL             — https://me.onlymatt.ca
```

Voir `.env.example` pour template.
**Ne pas ajouter** de dépendances sans justification claire.

## 🎨 Design Philosophy

**Minimaliste, élégant, rapide**
- Dark velvet: noir avec emerald/cyan subtils
- Typographie soignée (tracking, uppercase)
- Gradient text (slate → cyan → emerald)
- Hover effects subtils
- Pas d'animations complexes
