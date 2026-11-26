// Page renderers for NusaStat. Each view is a pure function of the data
// plus the small in-memory UI state (chart mode, search text, sort, topic).
// Event wiring lives in bindPage() below, called after the HTML is placed.

import {
  YEARS, POPULATION, GDP_GROWTH, INFLATION, UNEMPLOYMENT, POVERTY,
  KPI_2024, AGE_GROUPS, PROVINCES, GDP_SECTORS, TRADE_2024, TRADE_PARTNERS,
  INFLATION_GROUPS, WORKERS_SECTORS, SOCIAL_2024, RELEASES, INDICATORS,
  TOPICS, SOURCES,
} from './data.js';
import { lineChart, barChart, donutChart } from './charts.js';
import { density, esc } from './format.js';
import { renderSortableTable, attachSorting, sortRows } from './tables.js';

function srcLine(text) {
  return '<p class="source-line">Source: ' + esc(text) + '</p>';
}

function kpiCard(label, value, sub, src) {
  return '<div class="kpi"><div class="kpi-label">' + esc(label) + '</div>' +
    '<div class="kpi-value">' + esc(value) + '</div>' +
    '<div class="kpi-sub">' + esc(sub) + '</div>' +
    '<div class="kpi-src">Source: ' + esc(src) + '</div></div>';
}

function chartToggles(prefix, ui, chartKey, rangeKey) {
  const line = ui[chartKey] === 'line';
  const ten = ui[rangeKey] === 10;
  return '<div class="chart-toggle" role="group" aria-label="Chart options">' +
    '<span class="t-label">View:</span>' +
    '<button type="button" class="toggle-btn" data-toggle="' + prefix + '-chart" data-value="line" aria-pressed="' + line + '">Line</button>' +
    '<button type="button" class="toggle-btn" data-toggle="' + prefix + '-chart" data-value="bar" aria-pressed="' + (!line) + '">Bars</button>' +
    '<span class="t-label" style="margin-left:10px">Range:</span>' +
    '<button type="button" class="toggle-btn" data-toggle="' + prefix + '-range" data-value="5" aria-pressed="' + (!ten) + '">Last 5 years</button>' +
    '<button type="button" class="toggle-btn" data-toggle="' + prefix + '-range" data-value="10" aria-pressed="' + ten + '">10 years</button>' +
    '</div>';
}

function slicedSeries(values, range) {
  if (range === 5) return { years: YEARS.slice(-5), values: values.slice(-5) };
  return { years: YEARS, values };
}

function seriesChart(years, values, mode, opts) {
  return mode === 'bar' ? barChart(years, values, opts) : lineChart(years, values, opts);
}

function hbarList(items, maxValue, unit) {
  let html = '';
  items.forEach((item) => {
    const pct = Math.max(1, (item.value / maxValue) * 100);
    html += '<div class="hbar-row"><span class="hbar-label">' + esc(item.label) + '</span>' +
      '<span class="hbar-track"><span class="hbar-fill" style="display:block;width:' + pct.toFixed(1) + '%"></span></span>' +
      '<span class="hbar-value">' + item.value.toFixed(1) + unit + '</span></div>';
  });
  return html;
}

// ---------------- Overview ----------------

export function viewOverview() {
  const pop = slicedSeries(POPULATION, 10);
  const gdp = slicedSeries(GDP_GROWTH, 10);
  let releases = '';
  RELEASES.forEach((r) => {
    releases += '<li><span class="r-date">' + esc(r.date) + ' · ' + esc(r.src) + '</span>' +
      '<span class="r-title">' + esc(r.title) + '</span></li>';
  });
  return '' +
    '<section class="hero"><h1>Indonesia in numbers — <span class="gold">clear, sourced, current.</span></h1>' +
    '<p>NusaStat brings together Indonesia\u2019s key national statistics: population, economy, prices, labour and social indicators, each with its source and year.</p>' +
    '<p class="hero-meta">Latest data: 2024 · Sources: BPS, World Bank, Bank Indonesia</p></section>' +
    '<div class="kpi-grid">' +
    kpiCard('Population', KPI_2024.population.value, KPI_2024.population.sub, KPI_2024.population.src) +
    kpiCard('GDP', KPI_2024.gdp.value, KPI_2024.gdp.sub, KPI_2024.gdp.src) +
    kpiCard('GDP per capita', KPI_2024.gdpPerCapita.value, KPI_2024.gdpPerCapita.sub, KPI_2024.gdpPerCapita.src) +
    kpiCard('GDP growth', KPI_2024.growth.value, KPI_2024.growth.sub, KPI_2024.growth.src) +
    kpiCard('Inflation (Dec, yoy)', KPI_2024.inflation.value, KPI_2024.inflation.sub, KPI_2024.inflation.src) +
    kpiCard('Unemployment (Aug)', KPI_2024.unemployment.value, KPI_2024.unemployment.sub, KPI_2024.unemployment.src) +
    '</div>' +
    '<div class="two-col">' +
    '<section class="panel"><h3>Population 2015–2024</h3>' +
    '<p class="panel-sub">Indonesia grew from 255.5 to 281.6 million people in ten years.</p>' +
    '<div class="chart-wrap">' + lineChart(pop.years, pop.values, { unit: '', decimals: 1, height: 240 }) + '</div>' +
    srcLine('BPS, population projection 2024. Millions of people.') + '</section>' +
    '<section class="panel"><h3>Real GDP growth 2015–2024</h3>' +
    '<p class="panel-sub">Growth held near 5% a year, except for the 2020 pandemic contraction.</p>' +
    '<div class="chart-wrap">' + barChart(gdp.years, gdp.values, { unit: '%', decimals: 2, height: 240 }) + '</div>' +
    srcLine('BPS, % year-on-year. 2024: 5.03%.') + '</section>' +
    '</div>' +
    '<section class="panel"><h3>Latest releases</h3>' +
    '<p class="panel-sub">The newest headline figures from BPS.</p>' +
    '<ul class="release-list">' + releases + '</ul></section>' +
    '<section class="panel"><h3>Explore the statistics</h3>' +
    '<p class="panel-sub">Every section below opens with one click — charts, tables and the full indicator list.</p>' +
    '<div class="quick-links">' +
    '<a href="#/population">Population</a><a href="#/economy">Economy</a><a href="#/prices">Prices</a>' +
    '<a href="#/labour">Labour</a><a href="#/social">Social</a><a href="#/data">Data Explorer</a>' +
    '</div></section>';
}

// ---------------- Population ----------------

export function viewPopulation(ui) {
  const s = slicedSeries(POPULATION, ui.popRange);
  const q = ui.provSearch.trim().toLowerCase();
  let rows = PROVINCES.filter((p) => !q || p.name.toLowerCase().indexOf(q) !== -1);
  const table = renderSortableTable(
    [
      { key: 'name', label: 'Province' },
      { key: 'population', label: 'Population (million)', num: true },
      { key: 'area', label: 'Area (km²)', num: true },
      { key: 'density', label: 'Density (per km²)', num: true },
    ],
    rows.map((p) => ({ name: p.name, population: p.population, area: p.area, density: density(p.population, p.area) })),
    ui.provSortKey, ui.provSortDir, ['population', 'area', 'density'],
  );
  let ageBars = '';
  AGE_GROUPS.forEach((g) => {
    ageBars += '<div class="hbar-row"><span class="hbar-label">' + esc(g.label) + '</span>' +
      '<span class="hbar-track"><span class="hbar-fill gold" style="display:block;width:' + g.value.toFixed(1) + '%"></span></span>' +
      '<span class="hbar-value">' + g.value.toFixed(1) + '%</span></div>';
  });
  return '' +
    '<h2 class="page-title">Population</h2>' +
    '<p class="page-lede">281.6 million people in 2024 — the world\u2019s fourth-largest population, spread across 38 provinces and more than 17,000 islands.</p>' +
    '<section class="panel"><h3>Population 2015–2024</h3>' +
    '<p class="panel-sub">Millions of people. Switch between a line and bars, or zoom to the last five years.</p>' +
    chartToggles('pop', ui, 'popChart', 'popRange') +
    '<div class="chart-wrap">' + seriesChart(s.years, s.values, ui.popChart, { unit: '', decimals: 1 }) + '</div>' +
    srcLine('BPS, population projection 2024.') + '</section>' +
    '<div class="two-col">' +
    '<section class="panel"><h3>Age structure, 2024</h3>' +
    '<p class="panel-sub">Share of the population by age group — a young, working-age country.</p>' +
    ageBars + srcLine('BPS, 2024, rounded.') + '</section>' +
    '<section class="panel"><h3>Key facts</h3><ul class="stat-list">' +
    '<li><span>Provinces</span><span class="v">38</span></li>' +
    '<li><span>Land area</span><span class="v">1,904,569 km²</span></li>' +
    '<li><span>National density</span><span class="v">148 per km²</span></li>' +
    '<li><span>Largest province</span><span class="v">West Java, 49.94m</span></li>' +
    '<li><span>Densest province</span><span class="v">Jakarta, 15,904 per km²</span></li>' +
    '</ul>' + srcLine('BPS, 2024. Density = population ÷ area.') + '</section>' +
    '</div>' +
    '<section class="panel"><h3>Largest provinces, 2024</h3>' +
    '<p class="panel-sub">Click a column header to sort. Type to search the list.</p>' +
    '<div class="toolbar"><input id="prov-search" class="search-box" type="search" placeholder="Search provinces…" value="' + esc(ui.provSearch) + '" aria-label="Search provinces"></div>' +
    '<div id="prov-table">' + table + '</div>' +
    '<p class="result-count">' + rows.length + ' of 10 provinces shown</p>' +
    srcLine('BPS, 2024. Population in millions; density computed as population ÷ area.') + '</section>';
}

// ---------------- Economy ----------------

export function viewEconomy() {
  const gdp = slicedSeries(GDP_GROWTH, 10);
  const maxSector = Math.max.apply(null, GDP_SECTORS.map((s) => s.value));
  return '' +
    '<h2 class="page-title">Economy</h2>' +
    '<p class="page-lede">A US$1,396 billion economy in 2024 — the largest in Southeast Asia — growing 5.03% in real terms.</p>' +
    '<div class="kpi-grid">' +
    kpiCard('GDP', KPI_2024.gdp.value, KPI_2024.gdp.sub, KPI_2024.gdp.src) +
    kpiCard('GDP per capita', KPI_2024.gdpPerCapita.value, KPI_2024.gdpPerCapita.sub, KPI_2024.gdpPerCapita.src) +
    kpiCard('GDP growth', KPI_2024.growth.value, 'Real growth, year-on-year', KPI_2024.growth.src) +
    '</div>' +
    '<section class="panel"><h3>Real GDP growth 2015–2024</h3>' +
    '<p class="panel-sub">Percent per year. The 2020 bar is the pandemic contraction of −2.07%.</p>' +
    '<div class="chart-wrap">' + barChart(gdp.years, gdp.values, { unit: '%', decimals: 2, height: 300 }) + '</div>' +
    srcLine('BPS, % year-on-year.') + '</section>' +
    '<div class="two-col">' +
    '<section class="panel"><h3>GDP by sector, 2024</h3>' +
    '<p class="panel-sub">Share of GDP. Manufacturing is the largest single sector.</p>' +
    hbarList(GDP_SECTORS, maxSector, '%') +
    srcLine('BPS, 2024, rounded. Shares sum to 100%.') + '</section>' +
    '<section class="panel"><h3>Trade, 2024</h3>' +
    '<p class="panel-sub">Indonesia ran a goods trade surplus for the fifth year in a row.</p>' +
    '<ul class="stat-list">' +
    '<li><span>Exports</span><span class="v">US$264.70 billion</span></li>' +
    '<li><span>Imports</span><span class="v">US$233.66 billion</span></li>' +
    '<li><span>Trade surplus</span><span class="v up">US$31.04 billion</span></li>' +
    '<li><span>Foreign reserves (end 2024)</span><span class="v">US$155.7 billion</span></li>' +
    '<li><span>Exchange rate (end 2024)</span><span class="v">Rp16,162 / US$</span></li>' +
    '</ul>' + srcLine('BPS and Bank Indonesia, 2024.') +
    '<h3 style="margin-top:22px">Top export partners, 2024</h3>' +
    hbarList(TRADE_PARTNERS, 62.4, '') +
    srcLine('BPS, 2024, exports in US$ billion, rounded.') + '</section>' +
    '</div>';
}

// ---------------- Prices ----------------

export function viewPrices() {
  const inf = slicedSeries(INFLATION, 10);
  let rows = '';
  INFLATION_GROUPS.forEach((g) => {
    rows += '<tr><td>' + esc(g.label) + '</td><td class="num">' + g.value.toFixed(1) + '%</td></tr>';
  });
  return '' +
    '<h2 class="page-title">Prices &amp; Inflation</h2>' +
    '<p class="page-lede">Consumer price inflation was 1.57% year-on-year in December 2024 — inside Bank Indonesia\u2019s target range and the lowest December reading in a decade.</p>' +
    '<div class="kpi-grid">' +
    kpiCard('Inflation (Dec 2024)', '1.57%', 'Year-on-year, December', 'BPS, 2024') +
    kpiCard('Highest group', '7.0%', 'Personal care & other services', 'BPS, Dec 2024') +
    kpiCard('Lowest group', '0.2%', 'Information, communication & finance', 'BPS, Dec 2024') +
    '</div>' +
    '<section class="panel"><h3>CPI inflation 2015–2024</h3>' +
    '<p class="panel-sub">Percent year-on-year in December. The 2022 spike (5.51%) followed the fuel-price adjustment.</p>' +
    '<div class="chart-wrap">' + lineChart(inf.years, inf.values, { unit: '%', decimals: 2, color: '#b3261e' }) + '</div>' +
    srcLine('BPS, CPI, % year-on-year in December.') + '</section>' +
    '<section class="panel"><h3>Inflation by expenditure group, December 2024</h3>' +
    '<p class="panel-sub">Percent year-on-year. Personal care rose fastest; information and finance barely moved.</p>' +
    '<div class="table-wrap"><table class="data-table"><thead><tr><th>Expenditure group</th><th class="num">Inflation (yoy)</th></tr></thead><tbody>' +
    rows + '</tbody></table></div>' +
    srcLine('BPS, December 2024, rounded. CPI = Consumer Price Index; year-on-year compares with the same month a year earlier.') + '</section>';
}

// ---------------- Labour ----------------

export function viewLabour() {
  const u = slicedSeries(UNEMPLOYMENT, 10);
  const maxW = Math.max.apply(null, WORKERS_SECTORS.map((s) => s.value));
  return '' +
    '<h2 class="page-title">Labour</h2>' +
    '<p class="page-lede">Unemployment fell to 4.91% in August 2024 — the lowest August reading in the series — while agriculture still employs more workers than any other sector.</p>' +
    '<div class="kpi-grid">' +
    kpiCard('Unemployment (Aug 2024)', '4.91%', 'Open unemployment rate', 'BPS, 2024') +
    kpiCard('Labour force participation', 'around 71%', 'Share of working-age population', 'BPS, 2024') +
    kpiCard('Workers in agriculture', '28.2%', 'Share of all workers', 'BPS, 2024') +
    '</div>' +
    '<section class="panel"><h3>Unemployment 2015–2024</h3>' +
    '<p class="panel-sub">Open unemployment rate, % of the labour force, August each year. The 2020 peak (7.07%) was the pandemic shock.</p>' +
    '<div class="chart-wrap">' + lineChart(u.years, u.values, { unit: '%', decimals: 2, color: '#1e7a4c' }) + '</div>' +
    srcLine('BPS, open unemployment rate, August.') + '</section>' +
    '<div class="two-col">' +
    '<section class="panel"><h3>Workers by sector, 2024</h3>' +
    '<p class="panel-sub">Share of all workers. Agriculture, trade and manufacturing employ six in ten workers.</p>' +
    hbarList(WORKERS_SECTORS, maxW, '%') +
    srcLine('BPS, 2024, rounded.') + '</section>' +
    '<section class="panel"><h3>Youth unemployment</h3>' +
    '<p class="panel-sub">The hardest problem in the labour market is young people finding a first job.</p>' +
    '<p>' + esc(SOCIAL_2024.youthUnemploymentNote) + '</p>' +
    '<div class="callout"><p><strong>What to watch:</strong> the participation rate (around 71%) and the youth rate move slowly — check them each August when BPS publishes the labour survey.</p></div>' +
    srcLine('BPS, 2024.') + '</section>' +
    '</div>';
}

// ---------------- Social ----------------

export function viewSocial() {
  const p = slicedSeries(POVERTY, 10);
  return '' +
    '<h2 class="page-title">Social</h2>' +
    '<p class="page-lede">Poverty fell to 8.57% in September 2024 — the lowest on record — while the Human Development Index reached 75.02.</p>' +
    '<div class="kpi-grid">' +
    kpiCard('Poverty rate', '8.57%', 'September 2024', 'BPS, 2024') +
    kpiCard('Human Development Index', '75.02', 'High human development', 'BPS, 2024') +
    kpiCard('Life expectancy', '74.16 years', 'At birth', 'BPS, 2024') +
    '</div>' +
    '<section class="panel"><h3>Poverty rate 2015–2024</h3>' +
    '<p class="panel-sub">Percent of the population below the poverty line, September each year. The 2020 rise was the pandemic.</p>' +
    '<div class="chart-wrap">' + lineChart(p.years, p.values, { unit: '%', decimals: 2, color: '#1e7a4c' }) + '</div>' +
    srcLine('BPS, poverty rate, September.') + '</section>' +
    '<div class="two-col">' +
    '<section class="panel"><h3>Education &amp; health, 2024</h3>' +
    '<ul class="stat-list">' +
    '<li><span>Mean years of schooling</span><span class="v">9.0 years</span></li>' +
    '<li><span>Expected years of schooling</span><span class="v">13.2 years</span></li>' +
    '<li><span>Adult literacy (15+)</span><span class="v">96.4%</span></li>' +
    '<li><span>Life expectancy</span><span class="v">74.16 years</span></li>' +
    '<li><span>Human Development Index</span><span class="v">75.02</span></li>' +
    '</ul>' + srcLine('BPS, 2024.') + '</section>' +
    '<section class="panel"><h3>Reading the numbers</h3>' +
    '<p>The HDI combines health, education and income on a 0–100 scale; 75.02 puts Indonesia in the “high human development” band. Mean schooling of 9.0 years means the average adult finished junior high school — the gap to the expected 13.2 years is the schooling today\u2019s children can expect.</p>' +
    '<div class="callout"><p><strong>Progress in one line:</strong> in ten years poverty fell from 11.13% to 8.57% while life expectancy rose — the two headline social trends of the decade.</p></div>' +
    '</section>' +
    '</div>';
}

// ---------------- Data Explorer ----------------

export function filteredIndicators(ui) {
  const q = ui.exQuery.trim().toLowerCase();
  let rows = INDICATORS.filter((r) => {
    if (ui.exTopic !== 'All' && r.topic !== ui.exTopic) return false;
    if (!q) return true;
    return (r.indicator + ' ' + r.value + ' ' + r.unit + ' ' + r.source + ' ' + r.topic).toLowerCase().indexOf(q) !== -1;
  });
  if (ui.exSortKey) rows = sortRows(rows, ui.exSortKey, ui.exSortDir, ['numeric', 'year']);
  return rows;
}

export function viewExplorer(ui) {
  const rows = filteredIndicators(ui);
  let chips = '';
  TOPICS.forEach((t) => {
    chips += '<button type="button" class="chip" data-topic="' + esc(t) + '" aria-pressed="' + (ui.exTopic === t) + '">' + esc(t) + '</button>';
  });
  const table = renderSortableTable(
    [
      { key: 'indicator', label: 'Indicator' },
      { key: 'value', label: 'Value' },
      { key: 'unit', label: 'Unit' },
      { key: 'year', label: 'Year', num: true },
      { key: 'topic', label: 'Topic' },
      { key: 'source', label: 'Source' },
    ],
    rows, ui.exSortKey, ui.exSortDir, ['numeric', 'year'],
  );
  return '' +
    '<h2 class="page-title">Data Explorer</h2>' +
    '<p class="page-lede">Every headline indicator in one table — ' + INDICATORS.length + ' rows. Search, filter by topic, sort any column, and download exactly what you see as a CSV file.</p>' +
    '<section class="panel">' +
    '<div class="toolbar"><input id="ex-search" class="search-box" type="search" placeholder="Search indicators, values, sources…" value="' + esc(ui.exQuery) + '" aria-label="Search indicators">' +
    '<button type="button" class="btn" id="csv-btn">Download CSV</button></div>' +
    '<div class="chip-row" role="group" aria-label="Filter by topic">' + chips + '</div>' +
    '<p class="result-count" style="margin-top:12px">' + rows.length + ' of ' + INDICATORS.length + ' indicators shown</p>' +
    '<div id="ex-table">' + table + '</div>' +
    srcLine('BPS, World Bank and Bank Indonesia, 2024. Values are rounded published figures; see About for methodology.') +
    '</section>';
}

// ---------------- About ----------------

export function viewAbout() {
  let srcs = '';
  SOURCES.forEach((s) => {
    srcs += '<li><strong>' + esc(s.name) + '</strong> — ' + esc(s.note) + '</li>';
  });
  return '' +
    '<h2 class="page-title">About &amp; Sources</h2>' +
    '<p class="page-lede">What NusaStat is, how the figures were chosen, and where every number comes from.</p>' +
    '<section class="panel"><h3>What is NusaStat?</h3>' +
    '<p>NusaStat is an independent statistics portal for Indonesia. It gathers the country\u2019s headline figures — population, economy, prices, labour and social indicators — in one place, in plain language, with every figure labelled by its source and year.</p>' +
    '<p><strong>NusaStat is not the official site of BPS — Statistics Indonesia.</strong> For official releases, always check BPS itself.</p></section>' +
    '<section class="panel"><h3>Methodology</h3>' +
    '<ul class="stat-list">' +
    '<li><span>Country</span><span class="v">Indonesia</span></li>' +
    '<li><span>Reference year</span><span class="v">2024 (latest full year)</span></li>' +
    '<li><span>Series shown</span><span class="v">2015–2024</span></li>' +
    '<li><span>Rounding</span><span class="v">Published figures, rounded</span></li>' +
    '<li><span>Network</span><span class="v">None — works fully offline</span></li>' +
    '</ul>' +
    '<p>Figures are the published values from the sources below, rounded for readability. Where a value is approximate, the page says so (“around”). No figure was estimated or invented for this site; a doubtful value was left out rather than guessed. Densities are computed from the published population and area (population ÷ area).</p>' +
    '<p>Unemployment is measured in August and poverty in September each year, following BPS publication practice; inflation is the year-on-year change in December.</p></section>' +
    '<section class="panel"><h3>Sources</h3><ul class="stat-list">' + srcs + '</ul>' +
    '<p class="source-line">BPS publishes at bps.go.id; the World Bank at data.worldbank.org; Bank Indonesia at bi.go.id. This site stores no data from those sites — all figures are written into its own files.</p></section>' +
    '<section class="panel"><h3>Disclaimer</h3>' +
    '<p>Figures may be revised by their publishers after release. NusaStat shows the values as published for 2024; check the source for the latest revision. This site is a presentation of public statistics, not an official publication.</p></section>';
}

export function viewNotFound(route) {
  return '<div class="not-found"><h2>Page not found</h2>' +
    '<p>There is no statistics page at “#' + esc(route) + '”. Try one of the sections above.</p>' +
    '<p><a href="#/">Back to the overview</a></p></div>';
}

// ---------------- Event wiring ----------------

function csvEscape(field) {
  const s = String(field);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

export function downloadCsv(rows) {
  const header = ['Indicator', 'Value', 'Unit', 'Year', 'Topic', 'Source'];
  const lines = [header.map(csvEscape).join(',')];
  rows.forEach((r) => {
    lines.push([r.indicator, r.value, r.unit, r.year, r.topic, r.source].map(csvEscape).join(','));
  });
  const blob = new Blob([lines.join('\n') + '\n'], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nusastat-indicators.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Attach all handlers for the current page. rerender() re-renders the page.
export function bindPage(pageEl, route, ui, rerender) {
  pageEl.querySelectorAll('[data-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const kind = btn.getAttribute('data-toggle');
      const value = btn.getAttribute('data-value');
      if (kind === 'pop-chart') ui.popChart = value;
      if (kind === 'pop-range') ui.popRange = Number(value);
      rerender();
    });
  });

  const provSearch = pageEl.querySelector('#prov-search');
  if (provSearch) {
    provSearch.addEventListener('input', () => { ui.provSearch = provSearch.value; rerenderKeepFocus('prov-search', provSearch.selectionStart); });
    attachSorting(pageEl.querySelector('#prov-table'), ui.provSortKey, ui.provSortDir, (key, dir) => {
      ui.provSortKey = key; ui.provSortDir = dir; rerender();
    });
  }

  const exSearch = pageEl.querySelector('#ex-search');
  if (exSearch) {
    exSearch.addEventListener('input', () => { ui.exQuery = exSearch.value; rerenderKeepFocus('ex-search', exSearch.selectionStart); });
    attachSorting(pageEl.querySelector('#ex-table'), ui.exSortKey, ui.exSortDir, (key, dir) => {
      ui.exSortKey = key; ui.exSortDir = dir; rerender();
    });
  }

  pageEl.querySelectorAll('[data-topic]').forEach((chip) => {
    chip.addEventListener('click', () => { ui.exTopic = chip.getAttribute('data-topic'); rerender(); });
  });

  const csvBtn = pageEl.querySelector('#csv-btn');
  if (csvBtn) csvBtn.addEventListener('click', () => downloadCsv(filteredIndicators(ui)));

  function rerenderKeepFocus(id, pos) {
    rerender();
    const el = document.getElementById(id);
    if (el) { el.focus(); try { el.setSelectionRange(pos, pos); } catch (e) { /* older browsers */ } }
  }
}
