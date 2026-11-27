// NusaStat data: real figures for Indonesia, each with its source and year.
// Sources: Statistics Indonesia (BPS), World Bank, IMF, Bank Indonesia, BKPM.
// Values are the published headline figures; see About for the full source list.

export const META = {
  country: 'Indonesia',
  agency: 'NusaStat',
  updated: '27 November 2026',
  population: { value: 281.6, unit: 'million', year: 2024, source: 'BPS' },
};

export const KEY_INDICATORS = [
  { label: 'Population', value: '281.6', unit: 'million', delta: '+0.9% on 2023', dir: 'up', source: 'BPS, 2024' },
  { label: 'GDP (nominal)', value: '$1,396', unit: 'billion', delta: '+5.03% real growth', dir: 'up', source: 'World Bank / BPS, 2024' },
  { label: 'GDP per capita', value: '$4,960', unit: '', delta: '+4.1% on 2023', dir: 'up', source: 'World Bank, 2024' },
  { label: 'Unemployment', value: '4.76', unit: '%', delta: '−0.57 pp on Aug 2023', dir: 'down', source: 'BPS, Aug 2024' },
  { label: 'Poverty rate', value: '8.57', unit: '%', delta: '−0.46 pp on Mar 2024', dir: 'down', source: 'BPS, Sep 2024' },
  { label: 'Inflation (Dec, yoy)', value: '1.57', unit: '%', delta: 'within 1.5–3.5% target', dir: 'down', source: 'BPS, Dec 2024' },
  { label: 'Human Development Index', value: '0.722', unit: '', delta: 'High human development', dir: 'up', source: 'BPS / UNDP, 2024' },
  { label: 'Life expectancy', value: '73.9', unit: 'years', delta: '+0.3 years on 2023', dir: 'up', source: 'BPS, 2024' },
];

export const POPULATION_YEARS = {
  labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
  values: [255.6, 258.7, 261.9, 265.0, 268.1, 270.2, 272.7, 275.8, 278.7, 281.6],
  unit: 'million people',
  source: 'BPS, Population Projections and Census 2020',
};

export const AGE_GROUPS = [
  { label: '0–14 years', value: 24.1, color: '#2fae97' },
  { label: '15–64 years', value: 68.4, color: '#0e7c6b' },
  { label: '65+ years', value: 7.5, color: '#e8a317' },
];

export const PROVINCES = [
  { name: 'West Java', pop: 49.9, grdp: 62.4, hdi: 0.738, poverty: 7.5 },
  { name: 'East Java', pop: 41.9, grdp: 71.6, hdi: 0.736, poverty: 10.3 },
  { name: 'Central Java', pop: 38.0, grdp: 47.9, hdi: 0.725, poverty: 10.5 },
  { name: 'North Sumatra', pop: 15.6, grdp: 69.2, hdi: 0.750, poverty: 7.9 },
  { name: 'Banten', pop: 12.5, grdp: 62.1, hdi: 0.761, poverty: 5.9 },
  { name: 'Jakarta', pop: 10.6, grdp: 278.2, hdi: 0.817, poverty: 4.3 },
  { name: 'South Sulawesi', pop: 9.5, grdp: 66.8, hdi: 0.735, poverty: 8.3 },
  { name: 'Lampung', pop: 9.3, grdp: 47.4, hdi: 0.715, poverty: 10.6 },
  { name: 'South Sumatra', pop: 8.9, grdp: 63.5, hdi: 0.721, poverty: 11.0 },
  { name: 'West Sumatra', pop: 6.0, grdp: 49.8, hdi: 0.750, poverty: 5.7 },
  { name: 'Riau', pop: 7.0, grdp: 135.4, hdi: 0.739, poverty: 6.6 },
  { name: 'East Kalimantan', pop: 3.9, grdp: 212.9, hdi: 0.786, poverty: 6.0 },
  { name: 'Bali', pop: 4.4, grdp: 61.5, hdi: 0.773, poverty: 4.2 },
  { name: 'Yogyakarta', pop: 3.8, grdp: 45.2, hdi: 0.816, poverty: 10.7 },
  { name: 'Papua', pop: 1.1, grdp: 66.3, hdi: 0.622, poverty: 34.1 },
];

export const GDP_GROWTH = {
  labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
  values: [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.70, 5.31, 5.05, 5.03],
  unit: '% year-on-year',
  source: 'BPS, National Accounts',
};

export const GDP_LEVEL = {
  labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
  values: [861, 932, 1016, 1042, 1120, 1059, 1187, 1319, 1372, 1396],
  unit: 'US$ billion',
  source: 'World Bank, World Development Indicators',
};

export const GDP_SECTORS = [
  { label: 'Manufacturing', value: 18.7, color: '#0e7c6b' },
  { label: 'Wholesale & retail trade', value: 12.9, color: '#2fae97' },
  { label: 'Agriculture, forestry & fishing', value: 11.9, color: '#7fb069' },
  { label: 'Construction', value: 9.9, color: '#e8a317' },
  { label: 'Mining & quarrying', value: 8.5, color: '#8a6d3b' },
  { label: 'Public administration', value: 7.3, color: '#16324e' },
  { label: 'Transportation & storage', value: 5.5, color: '#5a8fb0' },
  { label: 'Information & communication', value: 4.4, color: '#7c6bb0' },
  { label: 'Financial & insurance', value: 4.1, color: '#b05a7c' },
  { label: 'Real estate', value: 2.7, color: '#9aa5ad' },
  { label: 'Other services', value: 14.1, color: '#d8dee2' },
];

export const TRADE = {
  exports: 264.7, imports: 233.7, surplus: 31.0, year: 2024, source: 'BPS / Ministry of Trade',
  topExports: [
    { label: 'Coal', value: 36.5 },
    { label: 'Iron & steel', value: 27.8 },
    { label: 'Palm oil', value: 23.6 },
    { label: 'Electrical machinery', value: 13.5 },
    { label: 'Vehicles & parts', value: 10.9 },
    { label: 'Rubber', value: 5.2 },
  ],
};

export const INFLATION_MONTHLY = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  values: [2.57, 2.75, 3.05, 3.00, 2.84, 2.51, 2.13, 2.12, 1.84, 1.71, 1.55, 1.57],
  unit: '% year-on-year, 2024',
  source: 'BPS, Consumer Price Index',
};

export const CPI_GROUPS = [
  { label: 'Food, beverages & tobacco', value: 2.2 },
  { label: 'Housing, water & electricity', value: 0.6 },
  { label: 'Transport', value: 0.8 },
  { label: 'Health', value: 1.9 },
  { label: 'Education', value: 2.0 },
  { label: 'Information & communication', value: -0.3 },
  { label: 'Restaurants & accommodation', value: 2.4 },
  { label: 'Personal care & other services', value: 5.1 },
];

export const LABOUR = {
  force: 152.1, employed: 144.9, unemployed: 7.2, rate: 4.76, year: 'Aug 2024', source: 'BPS, Sakernas',
  bySector: [
    { label: 'Agriculture', value: 27.9, color: '#7fb069' },
    { label: 'Trade', value: 18.8, color: '#2fae97' },
    { label: 'Manufacturing', value: 18.2, color: '#0e7c6b' },
    { label: 'Other services', value: 26.5, color: '#5a8fb0' },
    { label: 'Construction', value: 8.6, color: '#e8a317' },
  ],
  informal: 57.1,
  avgWage: 3.31,
  minWageJakarta: 5.4,
};

export const RELEASES = [
  { date: '2 Dec 2026', title: 'Consumer Price Index, November 2026' },
  { date: '5 Dec 2026', title: 'Poverty Profile, September 2026' },
  { date: '15 Dec 2026', title: 'Labour Force Survey, August 2026 — detailed tables' },
  { date: '5 Feb 2027', title: 'Gross Domestic Product, Q4 2026' },
  { date: '16 Feb 2027', title: 'Exports & Imports, January 2027' },
  { date: '2 Mar 2027', title: 'Consumer Price Index, February 2027' },
];

export const SOURCES = [
  { name: 'Statistics Indonesia (BPS)', what: 'Population, GDP, inflation, labour, poverty, HDI' },
  { name: 'World Bank — World Development Indicators', what: 'GDP in US$, GDP per capita, 2015–2024' },
  { name: 'International Monetary Fund (IMF)', what: 'Growth forecasts, government debt' },
  { name: 'Bank Indonesia', what: 'Policy rate, rupiah exchange rate' },
  { name: 'Ministry of Investment / BKPM', what: 'Investment realisation, 2024' },
];
