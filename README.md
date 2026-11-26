[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/bangpateng/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/bangpateng/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

# NusaStat — National Statistics Portal of Indonesia

Indonesia in numbers — clear, sourced, current. NusaStat gathers Indonesia's
headline statistics in one place: population, economy, prices, labour and
social indicators, each with its source and year.

## What it does

- **Overview** — six headline KPIs for 2024, population and GDP-growth
  charts, the latest BPS releases, and quick links to every section.
- **Population** — 2015–2024 population chart (line/bars toggle, 5- or
  10-year range), age structure, and a sortable, searchable table of the
  10 largest provinces with computed density.
- **Economy** — GDP growth chart, GDP by sector, trade (exports, imports,
  surplus), top export partners, reserves and exchange rate.
- **Prices** — CPI inflation 2015–2024 and inflation by expenditure group
  for December 2024.
- **Labour** — unemployment 2015–2024, workers by sector, youth
  unemployment note.
- **Social** — poverty 2015–2024, Human Development Index, life expectancy,
  schooling and literacy.
- **Data Explorer** — all 30 headline indicators in one table: text search,
  topic filter chips, sortable columns, and a working **Download CSV**
  button that exports exactly the rows on screen.
- **About & Sources** — methodology, full source list (BPS, World Bank,
  Bank Indonesia) and disclaimer.

## Data

Real published figures for 2024 from BPS — Statistics Indonesia, the World
Bank (World Development Indicators) and Bank Indonesia. Every figure on the
site names its source and year; approximate values are marked "around".
NusaStat is an independent portal, not the official BPS site.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — no build step, no network requests, no
framework. Pure ES modules with hand-built SVG charts; system fonts only.

## Layout

- `main.ts` — Node 22 hand-in program: copies `app/` + `screenshots/` to
  `/output` and writes `dossier.json` via `vendor/makefun-frontend.ts`.
- `app/index.html` — page shell and navigation.
- `app/main.js` — hash router and bootstrap.
- `app/views.js` — one renderer per page.
- `app/data.js` — every dataset and the explorer indicator list.
- `app/charts.js` — hand-built SVG line, bar and donut charts.
- `app/tables.js` — sortable-table helper.
- `app/format.js` — number formatting.
- `screenshots/` — real renders of the site in a browser.
