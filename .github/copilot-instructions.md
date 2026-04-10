# ONLYMATT Card - Instructions Copilot

## 📇 Projet

Carte de visite numérique ONLYMATT avec grouped link components et floating meta cards.

## 🎯 Objectif

Page de liens élégante avec composants groupés interactifs (hover expand + click-to-copy), floating OG meta cards, et support multi-pages (collabs, events).

## 🛠️ Stack

- **Framework**: Next.js 16.1.6 (App Router, TypeScript)
- **Styling**: Tailwind CSS 3.4
- **Images**: Bunny CDN (`onlymatt-public-zone.b-cdn.net`) + Bunny Storage (random rotation)
- **SEO**: Rank Math plugin sur WordPress (onlymatt.ca) pour OG tags
- **Deploy**: Vercel (https://me.onlymatt.ca)
- **WordPress**: onlymatt.ca sur Hostinger avec Breakdance builder

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

### Toujours vérifier :
- Build local (`npm run build`) avant commit
- Types TypeScript valides
- Open Graph metadata à jour

## 📝 Maintenance

- Page principale: `/` (app/page.tsx)
- Page collabs: `/collabs` (à créer — prochaine étape)
- Pas de base de données
- Variables d'environnement: `BUNNY_STORAGE_API_KEY` seulement

## 🔄 Workflow Git

- Branch: `master`
- Auto-deploy sur Vercel à chaque push
- Pas de branches feature (projet trop simple)

## 📦 Dépendances

Minimales :
- next, react, react-dom (runtime)
- tailwindcss (styling)
- typescript (types)


## ⚙️ Variables d'Environnement

Requises pour la rotation d'images:
- `BUNNY_STORAGE_API_KEY` (obligatoire)
- `BUNNY_STORAGE_ZONE` (default: onlymatt-public)
- `BUNNY_PHOTOS_FOLDER` (default: card)

Voir `.env.example` pour template.
**Ne pas ajouter** de dépendances sans justification claire.

## 🎨 Design Philosophy

**Minimaliste, élégant, rapide**
- Dark velvet: noir avec emerald/cyan subtils
- Typographie soignée (tracking, uppercase)
- Gradient text (slate → cyan → emerald)
- Hover effects subtils
- Pas d'animations complexes
