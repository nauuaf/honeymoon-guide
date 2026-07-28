# Working on this repo

Single-file static site (`index.html`) served by GitHub Pages from `main`.
Arabic-first, `dir="rtl"` — test every layout change for RTL and BiDi
(dates/times need `direction:ltr; unicode-bidi:isolate`, never
`text-align:start` inside an LTR run).

## Hard rules

- **Class contracts are API.** The JS (one big IIFE at the bottom) queries and
  toggles ~160 classes; the CSS was rebuilt around them. Rename nothing
  without grepping both HTML and JS. Section anchors (`#milan`, `#booking`, …)
  must never change.
- **Booking-board items carry stable `data-bk` ids** — localStorage check
  state is keyed on them, so keep the id when rewording an item and give
  any new item a fresh slug. The nav status strip shows unchecked-count
  pre-trip (hero owns the countdown) and the today-shortcut in-trip.
- **Design tokens only.** All colors are CSS variables in `:root` +
  `html[data-theme="dark"]`. Never hardcode a color; every visual must work in
  both themes. One accent (bougainvillea pink); sage = booked/free,
  gold = favorite, aqua = sea/map, champagne = luxury details. The gold
  `.up-chip` pill ("اقتراحكم" + bulb icon) marks items the user personally
  proposed; apply it to any future user-sourced additions.
- **Icons:** Tabler outline only, inlined in the `<svg>` sprite after `<body>`.
  Add new symbols to the sprite; never emoji, never a second icon style.
  Careful: icon `<svg>` in strings must go through `innerHTML`, not
  `textContent`.
- **No em-dashes in visible copy** (labels use `:`; Arabic prose uses `،`;
  ranges use `-`). No fake-italic on Arabic text.
- **Copy voice:** Saudi-dialect Arabic, warm and personal.
- **Viewport units:** use `dvh` with a `vh` fallback line. Modals must lock
  page scroll (`html.modal-open`) and trap focus.
- **Flex-scroll modal bodies** (`.hm-body`, `.qj-body`, drawer content) need
  `flex:1 1 auto;min-height:0` — without `min-height:0` the body can't shrink
  and long content clips off-screen instead of scrolling internally.
- **External links open as native webview modals**, never new tabs. The place
  modal (`.pm-overlay`, z-340, reuses `qj-*` chrome) embeds Google Maps via
  `https://www.google.com/maps?q=…&output=embed&hl=ar` with a "فتح في خرائط
  جوجل" fallback link (`.pm-ext`). `openPlace(query,title,trigger)` drives it;
  `pmOpen` guards ESC/scroll-lock when it stacks over a hotel modal. Dining
  picks with ≥3 Latin chars auto-wire a pin affordance; hotel modals get a
  location button from the `HOTEL_Q` address map.

- **Secret list** (`.sl-overlay`, z-350, reuses `qj-*` chrome): hidden
  romantic/privacy ideas modal. Opens by triple-tapping `.footer-brand` or
  via the `#segreto` hash; no visible affordance anywhere else. Keep it out
  of nav, overview, and search. Content lives in the `SL_ITEMS` array in JS.

## Verifying changes

No test suite — verify visually with the Playwright-cached headless Chromium:

```sh
~/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-mac-arm64/chrome-headless-shell \
  --headless --disable-gpu --window-size=1440,900 --screenshot=/tmp/x.png \
  --virtual-time-budget=15000 "file://$PWD/index.html"
```

- Check light + dark (force dark in a temp copy: replace
  `var isDark = savedTheme ? …` with `var isDark = true;`), and 390px mobile.
- Tall-window full-page captures distort `vh/dvh` sizing — don't trust the
  hero/map-rail proportions there.
- Syntax-check the inline JS with `node --check` after edits.
- Hash-anchored screenshots render blank in this shell; hide preceding
  sections in a temp copy instead.

## PWA layer

`manifest.webmanifest` + `sw.js` + `images/icon-*.png` /
`apple-touch-icon.png` (square center-crops of hero.jpg). Navigations
are network-first, so ordinary `index.html` edits reach installed
phones with no extra step. Bump `CACHE` in `sw.js` ONLY when the
precache list changes (new/renamed images, new core file). The SW
never intercepts the Google Maps embed. Registration is guarded, so
file:// headless previews are unaffected. Theme toggle also updates
`meta[name=theme-color]` (light `#FFF4E6` / dark `#1B130E`).

## Publishing

`git push origin main` (user says "publish"). Verify deploy:
`until curl -s "https://nauuaf.github.io/honeymoon-guide/?v=$RANDOM" | grep -q MARKER; do sleep 5; done`
Fetch before committing — other sessions (claude.ai web) push to this repo too.

## Images

Sources in `art-src/` (gitignored). Web files in `images/` as
`hero.jpg` / `city-*.jpg` (1400w q75) / `hotel-*.jpg` (1000w q78) via `sips`.
Painted golden-hour style with bougainvillea pink; keep the set matched.

## Open items

- Rome hotel unbooked: its card keeps the picker + "لم تُحجز بعد"; flip to a
  booked bar (green ✓, real dates, painted room) once the user books.
- Como day: option B (user's plan, starred) ends with a Riva Tritone sunset
  tour from Como Classic Boats at 7:30pm, not yet booked. Verified pricing
  ~€800/hr skippered (guide shows ~3,300 ر/ساعة); rapido back from Bellagio
  is the 17:05 departure, tickets must be prebought.
- Car BOOKED 2026-07-27 (board item + day-4 tag flipped to booked):
  pick up Milan Via Baracchini Fri 14 Aug morning, drop Roma Vaticano
  Mon 24 Aug (AT THE DESK: ask for a plate ending in an odd digit, see
  below). IDP from Riyadh still needed. Serravalle outlet pickup day
  (day-4 option B, starred), Ferragosto drive Milan→Florence 15 Aug
  (ZTL garage, hotel registers plate), Tuscany route Florence→Val
  d'Orcia→Positano 18 Aug, car PARKED at/near Antalia Aug 18-24 incl.
  the Capri days (CONFIRMED by hotel 2026-07-27, free, driver assists
  on arrival, hotel shuttle to port on the 21st timed to the ferry;
  user should tell hotel the ferry time once booked), ferry
  Positano↔Capri (out 21, back 24), Mon 24 Aug: first ferry back,
  drive Positano→Rome ~4h, drop at Rome office same day, taxi to FCO
  on the 25th. IDP still on booking board; flip when obtained. SS163
  targhe alterne 2026: daily in Aug 10:00-18:00 Vietri↔Positano, even
  dates ban even-ending plates; hotel-guest exemption covers check-in
  (18th) only, NOT the 24th (checkout was the 21st), hence the odd
  plate: 24 Aug is even, odd plate legal all day.
- Positano self-drive boat (day 10, Thu 20 Aug 9am-2pm): BOOKED with
  Chic & Fabulous (amalficoastrentalcf.com, CF Hope/Grace, Positano
  departure) as of 2026-07-24; day-10 tag + booking-board item flipped
  to booked. Remaining: user should confirm the exact meeting point at
  the pier the day before. Da Adolfo lunch that day is booked 2:30pm;
  Da Paolino (Capri) booked Sun 23 Aug 6:30pm. La Sponda sold out
  online; user is on the phone/email cancellation hunt.
- Honeymoon notes sent 2026-07-27 via Booking to all four booked hotels
  (announcement + "happily in your hands", no specific asks). The La
  Residenza one also gave the user's WhatsApp and asked for private
  boat options for Sat 22 Aug morning (Blue Grotto + island tour) via
  their concierge; awaiting replies. When that boat is confirmed, flip
  the "قارب كابري الخاص" booking-board item. If hotels offer "romantic
  touches", steer to alcohol-free (flowers/Caprese cake/fruit).
- Da Paolino name trap: "Da Paolino – Ristorante allegro" (dapaolino.it)
  is an unrelated restaurant in Soverato, Calabria. The booked Capri one
  is Paolino Lemon Trees, Via Palazzo a Mare 11 (paolinocapri.com).
  User was asked 2026-07-24 to verify their confirmation points to the
  Capri one; not yet re-confirmed.
- Fontelina lunch (Capri): request SUBMITTED 2026-07-24 for Fri 21 Aug
  3:00pm, table only (no sunbeds: the couple won't swim in public
  spots), awaiting confirmation, nothing paid. When confirmed: check
  the booking-board item, move the Fontelina fact from day-12 option B
  into day 11 as the arrival-day centerpiece (3pm late lunch), lighten
  that evening to a Piazzetta stroll, and slide Villa Verde dinner from
  day 11 to day 12 in place of Aurora (neither booked).
