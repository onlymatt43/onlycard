# PASSATION — Event campaign pages

> Written 2026-08-18, after the session that shipped commits `aa96291` → (this one).
> Status at time of writing: EXECUTED and validated in production by Matt.
> Everything below was verified against the code on that date. If you are reading
> this later, re-verify against the actual files — the code is the authority, not
> this document.

## What this system is

Each event in `data/events.json` gets a shareable page at `me.onlymatt.ca/e/[id]`.
The page has two modes, decided by one thing only: **whether the event has a
`pitch` block**.

- **No `pitch`** → classic mode: full LinkTree with a small event banner
  (`app/components/LinkTree.tsx`, unchanged behavior).
- **With `pitch`** → campaign mode: a dedicated conversion page
  (`app/components/EventCampaign.tsx`) — event header, availability,
  looking-for buttons, mini poll, direct contacts, link back to the full profile.

The switch lives in `app/e/[id]/page.tsx`. Everything is data-driven: creating a
campaign for a new event requires **zero code** — fill the event in
`data/events.json` (the admin panel works too: its PUT merges with a spread, so
unknown fields like `pitch` survive admin edits).

## The `pitch` block (all fields optional, read defensively)

```json
"pitch": {
  "availability": "Saturday Aug 29 — evening only (late)",
  "lookingFor": [
    "Kinky collabs",
    { "label": "Tell me what you want", "message": "Here's what I want" }
  ],
  "note": "One night, one full day — let's make it count.",
  "contactLabels": ["WHATSAPP", "EMAIL"],
  "poll": {
    "question": "What do you want to do with ONLYMATT?",
    "channelLabel": "WHATSAPP",
    "options": ["DUO", "GROUP"]
  }
}
```

- `lookingFor` entries are strings, or `{ label, message }` when the prefilled
  reply must differ from the displayed label. Every entry renders as a button
  that opens the channel with `"<message> — <event title>"` prefilled. The
  answer arrives from the sender's own account — that is how Matt knows who
  replied. No storage, no backend, by design.
- `poll` renders the same kind of buttons for its `options`.
- `contactLabels` selects which links from `data/config.json` →
  `groups.connect.links` appear as direct-contact buttons, **by label
  reference** — the contact data itself lives in config only (single source).
  For `mailto:` links, a subject is appended dynamically from the event title.

## Related pieces shipped in the same session

- **Audience filter on contacts** — connect links in `data/config.json` may
  carry `"audience": "creators"`. `app/components/Connect.tsx` shows only links
  without an audience (or `"public"`) on the public home. The creators email
  (`EMAIL` label) must never appear on the public `me` page — that is a Matt
  decision, not a technical accident.
- **Featured floating card** — `app/components/FloatingMetaCards.tsx` generates
  one oversized emerald card for the *nearest upcoming* event with
  `status: "confirmed"` (date check runs client-side, so it expires on its own
  and the next event takes over automatically). It fetches the event page's own
  OG image like regular cards do. `MetaCard` was extended (`featured`,
  `sublabel` props), not duplicated.
- **Background video per event** — an optional `"video"` URL on the event plays
  behind the campaign page through the pre-existing
  `app/components/BackgroundVideo.tsx` (it was orphaned; it is now wired, with
  an optional `overlayClassName` prop — campaign pages use `bg-black/60`, the
  default stays the original light veil). Without a video, the velvet gradient
  background applies.
- **Shared date formatter** — `app/lib/dates.ts` (`formatDate`), extracted from
  EventCard. Do not add another date formatter; import this one.

## Conventions to respect when touching this

- UI text is **English everywhere** (Matt's 2026-08-18 language decision;
  display language should eventually come from user settings, not per page).
- OG image/description come from the event's `image`/`description`; fallback is
  `DEFAULT_OG_IMAGE` in `app/lib/og.ts`.
- Check for existing components before writing new ones — two orphans were
  found and reused during this session; there may be more.

## Known pending item

- Toronto (`creator-con-canada`) has no background video yet — when the file is
  ready, add one `"video"` line to its event entry (admin panel or JSON edit).
