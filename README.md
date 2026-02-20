# ONLYMATT Card

**Carte de visite numérique de Mathieu Courchesne**

Une page de liens ultra-légère et élégante avec support Open Graph optimisé pour un partage magnifique sur tous les réseaux sociaux.

## 🎨 Features

- ✅ **Open Graph Cards** - Prévisualisation élégante sur WhatsApp, iMessage, LinkedIn, Twitter, etc.
- ✅ **Photos Aléatoires** - Rotation dynamique depuis Bunny Storage à chaque visite
- ✅ **Design Minimaliste** - Noir & blanc, typographie soignée
- ✅ **Ultra Rapide** - Next.js 16 avec optimisation d'images
- ✅ **Responsive** - Fonctionne parfaitement sur mobile et desktop

## 🚀 Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Styling**: Tailwind CSS 3.4
- **TypeScript**: Type-safe
- **Images**: Bunny CDN
- **Deploy**: Vercel

## 📦 Installation

```bash
npm install
```

### Configuration

Crée un fichier `.env.local` avec ton Bunny Storage API Key:

```bash
BUNNY_STORAGE_API_KEY=ton-api-key-bunny-storage
BUNNY_STORAGE_ZONE=onlymatt-public
BUNNY_FOLDER=card

### Variables d'environnement Vercel

Dans Vercel Dashboard → Settings → Environment Variables:

```
BUNNY_STORAGE_API_KEY = ton-api-key-bunny-storage
BUNNY_STORAGE_ZONE = onlymatt-public
BUNNY_FOLDER = card
```
```

**Obtenir l'API Key:** [panel.bunny.net/storage](https://panel.bunny.net/storage)

### Bunny Storage Structure

Le système pioche aléatoirement dans le folder Bunny Storage:

```
onlymatt-public/
  card/
    photo1.png
    photo2.jpg
    photo3.webp
    ...
```

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

## 📝 Metadata Optimisées

Le site génère automatiquement des cartes de prévisualisation optimisées pour :
- WhatsApp, Telegram, iMessage
- LinkedIn, Twitter/X, Facebook
- Discord, Slack
- Gmail, Outlook

## 📸 Image Open Graph

Image hébergée sur Bunny CDN :
- `https://onlymatt-public-zone.b-cdn.net/Untitled-7.png`
- Dimensions: 1200x630 (recommandé Open Graph)

## 🔗 Liens Inclus

- Site officiel (onlymatt.ca)
- Profil Amazon
- WhatsApp
- PayPal
- Wise

## 📄 License

© 2026 OM43 Digital - Mathieu Courchesne
