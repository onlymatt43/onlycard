# ONLYMATT Card - Instructions Copilot

## 📇 Projet

Carte de visite numérique minimaliste pour Mathieu Courchesne (ONLYMATT).

## 🎯 Objectif

Page unique ultra-légère optimisée pour le partage sur réseaux sociaux avec de belles cartes de prévisualisation (Open Graph).

## 🛠️ Stack

- **Framework**: Next.js 16.1.6 (App Router, TypeScript)
- **Styling**: Tailwind CSS 3.4
- **Images**: Bunny CDN (onlymatt-media.b-cdn.net) + Bunny Storage (random rotation)
- **Deploy**: Vercel (https://me.onlymatt.ca)

## 📸 Random Image Rotation

Le système pioche aléatoirement dans un folder Bunny Storage (`onlymatt-public/card/`) pour afficher une photo différente à chaque visite.

**API Route**: `/api/random-image` (dynamic)
**Component**: `RandomImage.tsx` (client-side fetch)

## 🚫 Règles Importantes

### Ne PAS modifier sans confirmation :
- La liste des liens (app/page.tsx)
- Les URLs Bunny CDN et Storage
- Les metadata Open Graph (app/layout.tsx)
- Le design minimaliste noir & blanc
- L'API route random-image (app/api/random-image/route.ts)

### Toujours vérifier :
- Build local (`npm run build`) avant commit
- Types TypeScript valides
- Open Graph metadata à jour

## 📝 Maintenance

Ce projet est **ultra minimal** par design :
- 1 page unique (/)
- Pas de backend
- Pas de variables d'environnement
- Pas de base de données

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
- Noir & blanc uniquement
- Typographie soignée (tracking, uppercase)
- Hover effects subtils
- Pas d'animations complexes
