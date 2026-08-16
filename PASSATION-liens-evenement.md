> ## ⛔ ÉTAT — constaté le 2026-08-16 (audit couche mémoire/settings)
> EXÉCUTÉE INTÉGRALEMENT : `data/events.json` est déjà à l'état cible (ids renommés), `LinkTree.tsx` et `app/e/[id]/page.tsx` existent. NE PAS REJOUER ces étapes.

# Passation — Liens par événement (`/e/[id]`) pour onlycard

> À exécuter dans une session « code » (Claude Code) ouverte sur le repo `onlycard`.
> Plan validé par Matt le 2026-08-12. Système EN PROD sur Vercel (déploie depuis `master`).
> Règles applicables : skill `onlymatt-rules` (no-hardcoding, no fake values, dynamique,
> pas de duplication, demander avant de sortir du périmètre). Rien de figé en dur : tout
> se lit depuis `data/events.json` et `data/config.json`.

## Objectif
Créer une route publique `me.onlymatt.ca/e/[id]` qui affiche le linktree existant (mêmes liens
que la page principale) avec un bandeau au nom de l'événement, et un **aperçu OG personnalisé par
événement** (pour que le lien collé sur Telegram ait l'air taillé pour cet événement). Contenu
volontairement minimal : liens + branding événement. PAS de CTA booking, PAS de « who's going »
pour l'instant.

## Étape 1 — Nettoyer `data/events.json` (prérequis, no-fake-values)
Les `id` actuels ne correspondent pas à leur titre. Corriger sans rien inventer :

- Entrée « Creator Con Canada » : `id` déjà correct = `creator-con-canada` → **ne pas toucher**.
- Entrée titre « HUSTLABALL TORONTO » : `id` actuel `grabbys-europe-2026` est faux → renommer
  en `hustlaball-toronto-2026` (événement passé, on le garde comme historique).
- Entrée titre « PRIDE TORONTO » : `id` actuel `creator-con-canada-2026` est faux → renommer en
  `pride-toronto-2026`. (Date de juin déjà passée : passer `status` à `past` si cohérent.)
- **Ajouter** l'événement manquant Grabbys Latin :
```json
{
  "id": "grabbys-latin",
  "title": "Grabbys Latin Awards",
  "description": "Latin Gay Awards Gala '26 by Grabbys Europe — Medellín.",
  "date": "2026-10-01",
  "endDate": "2026-10-03",
  "location": "Medellín, Colombia",
  "tags": ["Medellín", "Awards"],
  "status": "confirmed",
  "url": "https://thegrabbys.com/grabbys-latin/",
  "createdAt": "2026-08-12T00:00:00.000Z"
}
```
Vérifier qu'aucun autre fichier ne référence les anciens `id` renommés (`grep -rn "grabbys-europe-2026\|creator-con-canada-2026" app data`). S'il y en a, mettre à jour la référence.

## Étape 2 — Extraire un composant linktree partagé (anti-duplication)
Aujourd'hui `app/page.tsx` assemble inline : fond velvet, header (RandomImage + « ONLYMATT » +
« creative male model »), FloatingMetaCards, puis les groupes `PayOnlyMatt / SocialMedia /
AdultContent / Connect / Affiliates`.

- Extraire cet assemblage dans `app/components/LinkTree.tsx` (props optionnelles :
  `eventTitle?: string`, `eventUrl?: string`, et tout ce que `page.tsx` passe déjà comme
  `searchParams`-derived : `isSquareLayout`, `isEmbedMode`).
- `app/page.tsx` rend désormais `<LinkTree ... />` — **le rendu de la home doit rester
  strictement identique** (test de non-régression visuel obligatoire avant commit).
- Quand `eventTitle` est fourni, `LinkTree` affiche un petit bandeau sous le header
  (ex. `AT {eventTitle}` ou `LIVE @ {eventTitle}`), sinon rien. Style cohérent avec le header
  existant (même palette emerald/cyan, pas de nouvelle dépendance).

## Étape 3 — Créer la route `app/e/[id]/page.tsx`
- Lire `data/events.json`, trouver l'événement par `params.id`. Si absent → `notFound()`.
- `generateMetadata({ params })` : OG spécifique à l'événement —
  - `title`: `` `${event.title} — ONLYMATT` ``
  - `description`: `event.description` (fallback : description globale)
  - `openGraph.url`: `` `https://me.onlymatt.ca/e/${event.id}` ``
  - `images`: `event.image` si présent, sinon **réutiliser l'image OG déjà utilisée**
    (celle de `app/layout.tsx`, Bunny). Ne pas coller une nouvelle URL en dur : réutiliser la
    constante/valeur existante (au besoin extraire l'URL OG par défaut dans un petit module
    partagé importé par `layout.tsx` et cette route).
  - `twitter`: `summary_large_image` avec les mêmes titre/description/image.
- (Optionnel) `generateStaticParams()` à partir des `id` de `events.json` pour pré-générer.
- Le corps rend `<LinkTree eventTitle={event.title} eventUrl={event.url} />`.

## Étape 4 — Middleware
Aucun changement : `me.` sert déjà l'app à la racine, donc `/e/[id]` passe par le routing Next
normal. Vérifier seulement que le `matcher` n'exclut pas `/e/...` (il n'exclut que `api/_next/...`).

## Definition of « fait » (à prouver avant commit)
1. `me.onlymatt.ca/e/creator-con-canada` et `/e/grabbys-latin` rendent le linktree + bandeau événement.
2. La home `me.onlymatt.ca` est **inchangée** visuellement après extraction de `LinkTree`.
3. Aperçu OG spécifique par événement (vérifier via un validateur de cartes / partage de test).
4. `id` inconnu → 404.
5. Tout lu depuis `events.json` + `config.json` ; aucune valeur en dur ajoutée (grep sur le diff).
6. `next build` passe ; déployé sur Vercel depuis `master`.

## Liens finaux à utiliser sur Telegram
- Creator Con Canada : `https://me.onlymatt.ca/e/creator-con-canada`
- Grabbys Latin : `https://me.onlymatt.ca/e/grabbys-latin`
