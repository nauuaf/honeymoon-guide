# دليل شهر العسل — Italy Honeymoon Guide, August 2026

Interactive, Arabic-first (RTL) travel guide for a 14-night Italy honeymoon:
Milan → Florence → Positano → Capri → Rome (Aug 11–25, 2026).

**Live:** https://nauuaf.github.io/honeymoon-guide/

## What's inside

A single self-contained `index.html` (no build step, no dependencies beyond
Google Fonts): custom SVG Italy map with scroll-synced zoom, day-by-day plans
with A/B option tabs and timeline schedules, hotel details in modals, a
persistent booking checklist, dark mode, painted artwork, and full
print support.

## Structure

```
index.html      the entire site (HTML + CSS + JS + map geometry + icon sprite)
images/         optimized JPEGs served by the site
                  hero.jpg, city-{milan,florence,positano,capri,rome}.jpg,
                  hotel-{milan,florence,positano,capri}.jpg
art-src/        original PNG artwork (gitignored, local only)
interactive-honeymoon-map/  Next.js prototype the map was ported from (gitignored)
```

## Publishing

Push to `main` — GitHub Pages serves the repo root. Changes are live in
under a minute.

## Adding artwork

Drop the source PNG in `art-src/`, then cut a display-size JPEG into `images/`:

```sh
sips --resampleWidth 1400 -s format jpeg -s formatOptions 75 art-src/NEW.png --out images/city-x.jpg   # banners
sips --resampleWidth 1000 -s format jpeg -s formatOptions 78 art-src/NEW.png --out images/hotel-x.jpg  # hotel cards
```

Style: golden-hour painted scenes with bougainvillea pinks — match the
existing set.

## Status

All hotels booked except Rome (Hotel de Russie / Hotel Eden shortlisted).
