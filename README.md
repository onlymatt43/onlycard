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
