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
- Car rental decision pending (recommended: rent Aug 18 Florence→Salerno,
  drop before the coast; no rental drop-off exists in Positano).
- Positano self-drive boat (day 10, Thu 20 Aug 9am-2pm): user chose
  Chic & Fabulous (amalficoastrentalcf.com, CF Hope/Grace, Positano
  departure) over Lucibello and has emailed them; awaiting confirmation.
  When confirmed: flip the day-10 t-book tag + booking-board item to
  booked. Da Adolfo lunch that day is booked 2:30pm; Da Paolino (Capri)
  booked Sun 23 Aug 6:30pm. La Sponda sold out online; user is on the
  phone/email cancellation hunt.
