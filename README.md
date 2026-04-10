# ONLYMATT Card

**Carte de visite numérique de Mathieu Courchesne**

Page de liens élégante avec support Open Graph, floating meta cards, et composants groupés interactifs.

## 🎨 Features

- ✅ **Open Graph Cards** — Prévisualisation optimisée sur WhatsApp, iMessage, LinkedIn, Twitter, etc.
- ✅ **Floating Meta Cards** — Cards flottantes qui fetch les OG tags de URLs externes en temps réel
- ✅ **Grouped Link Components** — PAY ONLYMATT, SOCIAL MEDIA, ADULT CONTENT, CONNECT, AFFILIATES (hover expand + click-to-copy)
- ✅ **Photos Aléatoires** — Rotation dynamique depuis Bunny Storage à chaque visite
- ✅ **Dark Velvet Design** — Fond noir avec gradients emerald/cyan subtils
- ✅ **Ultra Rapide** — Next.js 16 avec optimisation d'images
- ✅ **Responsive** — Fonctionne parfaitement sur mobile et desktop

## 🚀 Stack

- **Framework**: Next.js 16.1.6 (App Router, TypeScript)
- **Styling**: Tailwind CSS 3.4
- **Images**: Bunny CDN (`onlymatt-public-zone.b-cdn.net`)
- **SEO**: Rank Math (WordPress onlymatt.ca) pour OG tags
- **Deploy**: Vercel (auto-deploy from `master`)

## 🧩 Architecture des composants

```
app/
  page.tsx                    — Page principale (/ )
  layout.tsx                  — Metadata OG globales
  globals.css                 — Styles globaux + animations
  api/
    fetch-meta/route.ts       — Proxy OG metadata pour floating cards
    random-image/route.ts     — Rotation photo Bunny Storage
  components/
    RandomImage.tsx            — Avatar avec photo aléatoire
    FloatingMetaCards.tsx      — Cards flottantes OG (6 slots)
    PayOnlyMatt.tsx            — Groupe: PayPal, Wise (hover expand + copy)
    SocialMedia.tsx            — Groupe: X, Instagram, Bluesky, TikTok, Facebook (hover expand + copy)
    AdultContent.tsx           — Groupe: RawFuckClub, OnlyFans, PornHub, JustFor.Fans (hover expand + copy)
    Connect.tsx                — Groupe: WhatsApp x2, Telegram (hover expand + copy)
    Affiliates.tsx             — Groupe: Intimaly, JockTribe, Cockblock, Beisar, Amazon (hover expand + copy)
    SocialIcon.tsx             — Icônes SVG pour les liens
    BackgroundVideo.tsx        — (unused — conservé pour référence)
    FloatingMetaCard.tsx       — (unused — ancienne version single card)
```

## 📸 Floating Meta Cards

Les cards flottantes affichent une preview OG de n'importe quelle URL. Configurées dans `tempLinks` de `page.tsx`.

L'API `/api/fetch-meta` sert de proxy pour scraper les OG tags. Des overrides hardcodés existent pour les plateformes qui bloquent le scraping (OnlyFans, JustFor.Fans).

## 🔗 Grouped Components

Chaque groupe suit le même pattern :
- **Hover** → expand pour montrer les sous-liens
- **Click** → copie toutes les URLs du groupe dans le clipboard
- Les liens de chaque groupe sont retirés de la liste principale pour éviter les doublons

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
