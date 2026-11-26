// NusaStat data — real published figures for Indonesia.
// Every figure names its source and year where it is shown.
// Sources: BPS — Statistics Indonesia; World Bank, World Development
// Indicators (WDI); Bank Indonesia. Values are rounded published figures;
// where a value is approximate the page says so ("around").

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

// Population, millions (BPS, population projection / census series).
export const POPULATION = [255.5, 258.7, 261.9, 265.0, 268.1, 270.2, 272.7, 275.8, 278.7, 281.6];

// Real GDP growth, % year-on-year (BPS).
export const GDP_GROWTH = [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.70, 5.31, 5.05, 5.03];

// Consumer price inflation, % year-on-year in December (BPS).
export const INFLATION = [3.35, 3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57];

// Open unemployment rate, % in August (BPS).
export const UNEMPLOYMENT = [6.18, 5.61, 5.50, 5.34, 5.28, 7.07, 6.49, 5.86, 5.32, 4.91];

// Poverty rate, % in September (BPS).
export const POVERTY = [11.13, 10.70, 10.12, 9.66, 9.22, 10.19, 9.71, 9.57, 9.36, 8.57];

export const KPI_2024 = {
  population: { value: '281.6 million', sub: '38 provinces · 1,904,569 km²', src: 'BPS, projection 2024' },
  gdp: { value: 'Rp22,139 trillion', sub: 'US$1,396 billion nominal', src: 'BPS / World Bank, 2024' },
  gdpPerCapita: { value: 'US$4,925', sub: 'Rp78.6 million per person', src: 'BPS / World Bank, 2024' },
  growth: { value: '5.03%', sub: 'Real GDP growth, year-on-year', src: 'BPS, 2024' },
  inflation: { value: '1.57%', sub: 'CPI inflation, year-on-year, December', src: 'BPS, 2024' },
  unemployment: { value: '4.91%', sub: 'Open unemployment, August', src: 'BPS, 2024' },
  poverty: { value: '8.57%', sub: 'Poverty rate, September', src: 'BPS, 2024' },
  hdi: { value: '75.02', sub: 'Human Development Index', src: 'BPS, 2024' },
};

// Age structure 2024, % of population (BPS, rounded).
export const AGE_GROUPS = [
  { label: '0–14 years', value: 24.5 },
  { label: '15–64 years', value: 68.3 },
  { label: '65+ years', value: 7.2 },
];

// Ten largest provinces, 2024 (BPS). Population in millions, area in km².
export const PROVINCES = [
  { name: 'West Java', population: 49.94, area: 35378 },
  { name: 'East Java', population: 41.81, area: 47803 },
  { name: 'Central Java', population: 37.89, area: 32801 },
  { name: 'North Sumatra', population: 15.59, area: 72981 },
  { name: 'Banten', population: 12.43, area: 9663 },
  { name: 'Jakarta', population: 10.56, area: 664 },
  { name: 'South Sulawesi', population: 9.36, area: 46717 },
  { name: 'Lampung', population: 9.32, area: 34624 },
  { name: 'South Sumatra', population: 8.84, area: 91592 },
  { name: 'Riau', population: 6.73, area: 87024 },
];

// GDP by sector 2024, % of GDP (BPS, rounded).
export const GDP_SECTORS = [
  { label: 'Manufacturing', value: 18.9 },
  { label: 'Wholesale & retail trade', value: 12.9 },
  { label: 'Agriculture, forestry & fishing', value: 12.5 },
  { label: 'Construction', value: 10.2 },
  { label: 'Mining & quarrying', value: 9.1 },
  { label: 'Transportation & storage', value: 6.5 },
  { label: 'Information & communication', value: 4.2 },
  { label: 'Financial services', value: 4.1 },
  { label: 'Public administration', value: 3.4 },
  { label: 'Education', value: 3.1 },
  { label: 'Real estate', value: 2.7 },
  { label: 'Health services', value: 1.4 },
  { label: 'Other services', value: 11.0 },
];

// Trade 2024, US$ billion (BPS).
export const TRADE_2024 = {
  exports: 264.70,
  imports: 233.66,
  surplus: 31.04,
  reserves: 155.7,
  exchangeRate: 'Rp16,162',
};

// Main export partners 2024, exports in US$ billion (BPS, rounded).
export const TRADE_PARTNERS = [
  { label: 'China', value: 62.4 },
  { label: 'United States', value: 26.3 },
  { label: 'Japan', value: 20.8 },
  { label: 'India', value: 18.0 },
  { label: 'Singapore', value: 13.9 },
];

// CPI inflation by expenditure group, December 2024, % year-on-year (BPS, rounded).
export const INFLATION_GROUPS = [
  { label: 'Food, beverages & tobacco', value: 2.4 },
  { label: 'Clothing & footwear', value: 1.3 },
  { label: 'Housing, water, electricity & household fuel', value: 0.6 },
  { label: 'Household equipment & routine maintenance', value: 1.1 },
  { label: 'Health', value: 1.8 },
  { label: 'Transportation', value: 1.0 },
  { label: 'Information, communication & financial services', value: 0.2 },
  { label: 'Recreation, sport & culture', value: 1.5 },
  { label: 'Education', value: 1.9 },
  { label: 'Food & beverage serving services', value: 2.1 },
  { label: 'Personal care & other services', value: 7.0 },
];

// Workers by sector 2024, % of workers (BPS, rounded).
export const WORKERS_SECTORS = [
  { label: 'Agriculture', value: 28.2 },
  { label: 'Trade', value: 19.1 },
  { label: 'Manufacturing', value: 13.6 },
  { label: 'Construction', value: 8.9 },
  { label: 'Accommodation & food services', value: 7.0 },
  { label: 'Education', value: 5.6 },
  { label: 'Public administration', value: 4.9 },
  { label: 'Transportation & storage', value: 4.6 },
  { label: 'Health services', value: 2.0 },
  { label: 'Other sectors', value: 6.1 },
];

// Social indicators 2024 (BPS).
export const SOCIAL_2024 = {
  hdi: 75.02,
  lifeExpectancy: 74.16,
  meanSchooling: 9.0,
  expectedSchooling: 13.2,
  literacy: 96.4,
  labourForceParticipation: 'around 71%',
  youthUnemploymentNote: 'Young people (15–24) face an unemployment rate several times the national average — the highest of any age group (BPS, 2024).',
};

// Latest BPS releases shown on the overview page.
export const RELEASES = [
  { date: '5 Feb 2025', title: 'Economic growth 2024: 5.03%', src: 'BPS' },
  { date: '2 Jan 2025', title: 'Inflation December 2024: 1.57% year-on-year', src: 'BPS' },
  { date: '5 Nov 2024', title: 'Open unemployment August 2024: 4.91%', src: 'BPS' },
  { date: '15 Jan 2025', title: 'Poverty September 2024: 8.57%', src: 'BPS' },
  { date: '15 Jan 2025', title: 'Exports December 2024: US$23.46 billion', src: 'BPS' },
];

// Full indicator list for the Data Explorer (28 rows).
// value is the display string; numeric is used for sorting.
export const INDICATORS = [
  { indicator: 'Population', value: '281.6 million', numeric: 281.6, unit: 'million people', year: 2024, topic: 'Population', source: 'BPS' },
  { indicator: 'Population growth', value: '1.0% per year', numeric: 1.0, unit: '% per year', year: 2024, topic: 'Population', source: 'BPS' },
  { indicator: 'Number of provinces', value: '38', numeric: 38, unit: 'provinces', year: 2024, topic: 'Population', source: 'BPS' },
  { indicator: 'Population density', value: '148 per km²', numeric: 148, unit: 'people per km²', year: 2024, topic: 'Population', source: 'BPS' },
  { indicator: 'Share aged 0–14', value: '24.5%', numeric: 24.5, unit: '% of population', year: 2024, topic: 'Population', source: 'BPS' },
  { indicator: 'Share aged 15–64', value: '68.3%', numeric: 68.3, unit: '% of population', year: 2024, topic: 'Population', source: 'BPS' },
  { indicator: 'Share aged 65+', value: '7.2%', numeric: 7.2, unit: '% of population', year: 2024, topic: 'Population', source: 'BPS' },
  { indicator: 'Nominal GDP', value: 'Rp22,139 trillion', numeric: 22139, unit: 'Rp trillion', year: 2024, topic: 'Economy', source: 'BPS' },
  { indicator: 'Nominal GDP (US$)', value: 'US$1,396 billion', numeric: 1396, unit: 'US$ billion', year: 2024, topic: 'Economy', source: 'World Bank' },
  { indicator: 'GDP per capita', value: 'US$4,925', numeric: 4925, unit: 'US$', year: 2024, topic: 'Economy', source: 'World Bank' },
  { indicator: 'Real GDP growth', value: '5.03%', numeric: 5.03, unit: '% per year', year: 2024, topic: 'Economy', source: 'BPS' },
  { indicator: 'Exports', value: 'US$264.70 billion', numeric: 264.7, unit: 'US$ billion', year: 2024, topic: 'Economy', source: 'BPS' },
  { indicator: 'Imports', value: 'US$233.66 billion', numeric: 233.66, unit: 'US$ billion', year: 2024, topic: 'Economy', source: 'BPS' },
  { indicator: 'Trade surplus', value: 'US$31.04 billion', numeric: 31.04, unit: 'US$ billion', year: 2024, topic: 'Economy', source: 'BPS' },
  { indicator: 'Foreign exchange reserves', value: 'US$155.7 billion', numeric: 155.7, unit: 'US$ billion', year: 2024, topic: 'Economy', source: 'Bank Indonesia' },
  { indicator: 'Exchange rate (end of year)', value: 'Rp16,162 per US$', numeric: 16162, unit: 'Rp per US$', year: 2024, topic: 'Economy', source: 'Bank Indonesia' },
  { indicator: 'Manufacturing share of GDP', value: '18.9%', numeric: 18.9, unit: '% of GDP', year: 2024, topic: 'Economy', source: 'BPS' },
  { indicator: 'CPI inflation (December, yoy)', value: '1.57%', numeric: 1.57, unit: '% per year', year: 2024, topic: 'Prices', source: 'BPS' },
  { indicator: 'CPI inflation — food, beverages & tobacco', value: '2.4%', numeric: 2.4, unit: '% per year', year: 2024, topic: 'Prices', source: 'BPS' },
  { indicator: 'CPI inflation — personal care & other services', value: '7.0%', numeric: 7.0, unit: '% per year', year: 2024, topic: 'Prices', source: 'BPS' },
  { indicator: 'Open unemployment rate', value: '4.91%', numeric: 4.91, unit: '% of labour force', year: 2024, topic: 'Labour', source: 'BPS' },
  { indicator: 'Labour force participation rate', value: 'around 71%', numeric: 71, unit: '% of working-age population', year: 2024, topic: 'Labour', source: 'BPS' },
  { indicator: 'Workers in agriculture', value: '28.2%', numeric: 28.2, unit: '% of workers', year: 2024, topic: 'Labour', source: 'BPS' },
  { indicator: 'Workers in manufacturing', value: '13.6%', numeric: 13.6, unit: '% of workers', year: 2024, topic: 'Labour', source: 'BPS' },
  { indicator: 'Poverty rate', value: '8.57%', numeric: 8.57, unit: '% of population', year: 2024, topic: 'Social', source: 'BPS' },
  { indicator: 'Human Development Index', value: '75.02', numeric: 75.02, unit: 'index (0–100)', year: 2024, topic: 'Social', source: 'BPS' },
  { indicator: 'Life expectancy at birth', value: '74.16 years', numeric: 74.16, unit: 'years', year: 2024, topic: 'Social', source: 'BPS' },
  { indicator: 'Mean years of schooling', value: '9.0 years', numeric: 9.0, unit: 'years', year: 2024, topic: 'Social', source: 'BPS' },
  { indicator: 'Expected years of schooling', value: '13.2 years', numeric: 13.2, unit: 'years', year: 2024, topic: 'Social', source: 'BPS' },
  { indicator: 'Adult literacy rate (15+)', value: '96.4%', numeric: 96.4, unit: '% of adults', year: 2024, topic: 'Social', source: 'BPS' },
];

export const TOPICS = ['All', 'Population', 'Economy', 'Prices', 'Labour', 'Social'];

export const SOURCES = [
  { name: 'BPS — Statistics Indonesia', note: 'Population, GDP, inflation, unemployment, poverty, HDI and provincial figures. National statistical office of Indonesia.' },
  { name: 'World Bank — World Development Indicators', note: 'GDP in US dollars and GDP per capita, 2024.' },
  { name: 'Bank Indonesia', note: 'Foreign exchange reserves and the rupiah exchange rate at the end of 2024.' },
];
