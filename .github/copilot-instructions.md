# ONLYMATT Card - Instructions Copilot

## 📇 Projet

Carte de visite numérique minimaliste pour Mathieu Courchesne (ONLYMATT).

## 🎯 Objectif

Page unique ultra-légère optimisée pour le partage sur réseaux sociaux avec de belles cartes de prévisualisation (Open Graph).

## 🛠️ Stack

- **Framework**: Next.js 16.1.6 (App Router, TypeScript)
- **Styling**: Tailwind CSS 3.4
- **Images**: Bunny CDN (onlymatt-media.b-cdn.net)
- **Deploy**: Vercel (https://me.onlymatt.ca)

## 🚫 Règles Importantes

### Ne PAS modifier sans confirmation :
- La liste des liens (app/page.tsx)
- Les URLs Bunny CDN
- Les metadata Open Graph (app/layout.tsx)
- Le design minimaliste noir & blanc

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

**Ne pas ajouter** de dépendances sans justification claire.

## 🎨 Design Philosophy

**Minimaliste, élégant, rapide**
- Noir & blanc uniquement
- Typographie soignée (tracking, uppercase)
- Hover effects subtils
- Pas d'animations complexes
