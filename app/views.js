// NusaStat page views: each route renders its HTML, then mounts its charts
// and controls. Every figure comes from data.js with its source and year.

import * as D from './data.js';
import { lineChart, barChart, hBarChart, donutChart } from './charts.js';

function srcLine(text) {
  return '<p class="src">Source: ' + text + '</p>';
}

function kpiCard(k) {
  return '<div class="kpi"><div class="label">' + k.label + '</div>' +
    '<div class="value num">' + k.value + (k.unit ? ' <small>' + k.unit + '</small>' : '') + '</div>' +
    '<div class="delta ' + k.dir + '">' + k.delta + '</div>' +
    '<div class="src">' + k.source + '</div></div>';
}

function chartCard(id, title, body, source, tall) {
  return '<section class="card"><h2>' + title + '</h2>' + body +
    '<div class="chart-wrap"><canvas id="' + id + '" class="chart' + (tall ? ' tall' : '') + '"></canvas><div class="tip"></div></div>' +
    srcLine(source) + '</section>';
}

function legend(items) {
  return '<div class="legend">' + items.map((it) =>
    '<span><i style="background:' + it.color + '"></i>' + it.label + ' — ' + it.value + '%</span>').join('') + '</div>';
}

function pageHead(kicker, title, lede) {
  return '<div class="page-head"><div class="kicker">' + kicker + '</div><h1>' + title + '</h1>' +
    '<p class="lede">' + lede + '</p>' +
    '<p class="updated">Last updated ' + D.META.updated + ' · Figures in Indonesian rupiah unless stated</p></div>';
}

function sectionCards() {
  const secs = [
    ['#/population', 'Population', '281.6 million people in 38 provinces — growth, age structure and where Indonesians live.', 'Explore population →'],
    ['#/economy', 'Economy', 'GDP of $1,396 billion, 5.03% growth, sectors and trade with the world.', 'Explore the economy →'],
    ['#/prices', 'Prices', 'Inflation at 1.57% in December 2024 — monthly CPI and what got more expensive.', 'Explore prices →'],
    ['#/labour', 'Labour', '152.1 million in the labour force, 4.76% unemployed, wages and informality.', 'Explore labour →'],
    ['#/regions', 'Regions', 'Compare all 38 provinces: population, output per person, HDI and poverty.', 'Compare regions →'],
    ['#/about', 'About & sources', 'Where every figure comes from, how it is measured, and what is released next.', 'Read about NusaStat →'],
  ];
  return '<div class="sections">' + secs.map((s) =>
    '<a class="section-card" href="' + s[0] + '"><h3>' + s[1] + '</h3><p>' + s[2] + '</p><span class="go">' + s[3] + '</span></a>').join('') + '</div>';
}

export function renderHome() {
  const kpis = D.KEY_INDICATORS.map(kpiCard).join('');
  const html = pageHead('National Statistics Office of Indonesia', 'Indonesia in numbers',
    'The headline statistics of the world’s fourth most populous country — population, economy, prices, work and regions, with every figure sourced and dated.') +
    '<div class="kpis">' + kpis + '</div>' +
    '<div class="note"><strong>Latest release:</strong> the economy grew <strong>5.03%</strong> in 2024 and the poverty rate fell to <strong>8.57%</strong> in September 2024 — the lowest on record. <a href="#/economy">See the economy →</a></div>' +
    '<div class="grid-2">' +
    chartCard('ch-pop', 'Population, 2015–2024', '<p>Ten years of growth, from 255.6 to 281.6 million people.</p>', D.POPULATION_YEARS.source) +
    chartCard('ch-gdp', 'Real GDP growth, 2015–2024', '<p>Annual growth, including the 2020 pandemic contraction of −2.07%.</p>', D.GDP_GROWTH.source) +
    '</div>' +
    sectionCards() +
    '<section class="card"><h2>Coming up</h2><ul class="release-list">' +
    D.RELEASES.slice(0, 4).map((r) => '<li><span>' + r.title + '</span><span class="date">' + r.date + '</span></li>').join('') +
    '</ul>' + srcLine('NusaStat release calendar') + '</section>';
  return {
    html,
    mount() {
      const redrawers = [];
      redrawers.push(lineChart(document.getElementById('ch-pop'), { labels: D.POPULATION_YEARS.labels, values: D.POPULATION_YEARS.values, unit: 'million', yMin: 240, yMax: 300 }));
      redrawers.push(barChart(document.getElementById('ch-gdp'), { labels: D.GDP_GROWTH.labels, values: D.GDP_GROWTH.values, unit: '%' }));
      return redrawers;
    },
  };
}

export function renderPopulation() {
  const top10 = [...D.PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 10);
  const rows = [...D.PROVINCES].sort((a, b) => b.pop - a.pop).map((p) =>
    '<tr><td>' + p.name + '</td><td class="num">' + p.pop.toFixed(1) + '</td>' +
    '<td class="num">' + p.grdp.toFixed(1) + '</td><td class="num">' + p.hdi.toFixed(3) + '</td>' +
    '<td class="num">' + p.poverty.toFixed(1) + '%</td></tr>').join('');
  const html = pageHead('Population', '281.6 million Indonesians',
    'The population grew 0.9% in 2024. Most Indonesians live on Java — 56% of the population on 7% of the land — and the median age is 30.5 years.') +
    '<div class="kpis">' +
    kpiCard({ label: 'Population', value: '281.6', unit: 'million', delta: '+0.9% on 2023', dir: 'up', source: 'BPS, 2024' }) +
    kpiCard({ label: 'Median age', value: '30.5', unit: 'years', delta: 'Working-age majority', dir: 'up', source: 'UN World Population Prospects, 2024' }) +
    kpiCard({ label: 'Population density', value: '148', unit: 'per km²', delta: 'Jakarta: 14,500 per km²', dir: 'up', source: 'BPS, 2024' }) +
    kpiCard({ label: 'Fertility rate', value: '2.0', unit: 'children per woman', delta: 'At replacement level', dir: 'down', source: 'BPS, 2024' }) +
    '</div>' +
    '<div class="grid-2">' +
    chartCard('ch-pop-line', 'Population, 2015–2024', '<p>Steady growth of about 2.5 million people a year.</p>', D.POPULATION_YEARS.source, true) +
    '<section class="card"><h2>Age structure, 2024</h2><p>Indonesia is in its demographic dividend: more than two in three people are of working age.</p>' +
    '<div class="chart-wrap"><canvas id="ch-age" class="chart tall"></canvas><div class="tip"></div></div>' +
    legend(D.AGE_GROUPS) + srcLine('BPS, 2024') + '</section>' +
    '</div>' +
    chartCard('ch-prov', 'Largest provinces by population', '<p>West Java alone holds more people than most countries — 49.9 million.</p>', 'BPS, 2024', true) +
    '<section class="card"><h2>All provinces in this table</h2><p>Population in millions, GRDP per capita in million rupiah, HDI and poverty rate. Click a column heading to sort.</p>' +
    '<div class="table-scroll"><table class="data" id="prov-table"><thead><tr>' +
    '<th class="sortable" data-key="name">Province</th><th class="sortable" data-key="pop">Population (m)</th>' +
    '<th class="sortable" data-key="grdp">GRDP / capita (Rp m)</th><th class="sortable" data-key="hdi">HDI</th>' +
    '<th class="sortable" data-key="poverty">Poverty (%)</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    srcLine('BPS, 2024. Fifteen largest provinces shown; Indonesia has 38 provinces.') + '</section>';
  return {
    html,
    mount() {
      const redrawers = [];
      redrawers.push(lineChart(document.getElementById('ch-pop-line'), { labels: D.POPULATION_YEARS.labels, values: D.POPULATION_YEARS.values, unit: 'million', yMin: 240, yMax: 300 }));
      redrawers.push(donutChart(document.getElementById('ch-age'), { items: D.AGE_GROUPS, centerLabel: '68.4%\nof working\nage' }));
      redrawers.push(hBarChart(document.getElementById('ch-prov'), { items: top10.map((p) => ({ label: p.name, value: p.pop })), unit: 'm' }));
      const table = document.getElementById('prov-table');
      let data = [...D.PROVINCES].sort((a, b) => b.pop - a.pop);
      let sortKey = 'pop';
      let asc = false;
      const paint = () => {
        table.querySelector('tbody').innerHTML = data.map((p) =>
          '<tr><td>' + p.name + '</td><td class="num">' + p.pop.toFixed(1) + '</td>' +
          '<td class="num">' + p.grdp.toFixed(1) + '</td><td class="num">' + p.hdi.toFixed(3) + '</td>' +
          '<td class="num">' + p.poverty.toFixed(1) + '%</td></tr>').join('');
      };
      table.querySelectorAll('th.sortable').forEach((th) => {
        th.addEventListener('click', () => {
          const key = th.dataset.key;
          if (sortKey === key) asc = !asc; else { sortKey = key; asc = key === 'name'; }
          data.sort((a, b) => {
            const av = a[key];
            const bv = b[key];
            if (typeof av === 'string') return asc ? av.localeCompare(bv) : bv.localeCompare(av);
            return asc ? av - bv : bv - av;
          });
          paint();
        });
      });
      return redrawers;
    },
  };
}

export function renderEconomy() {
  const html = pageHead('Economy', 'A $1,396 billion economy',
    'Indonesia is the world’s 16th largest economy. Growth held above 5% in 2024, driven by household consumption and investment, with a $31 billion trade surplus.') +
    '<div class="kpis">' +
    kpiCard({ label: 'GDP (nominal)', value: '$1,396', unit: 'billion', delta: '+5.03% real growth', dir: 'up', source: 'World Bank / BPS, 2024' }) +
    kpiCard({ label: 'GDP per capita', value: '$4,960', unit: '', delta: '+4.1% on 2023', dir: 'up', source: 'World Bank, 2024' }) +
    kpiCard({ label: 'Trade surplus', value: '$31.0', unit: 'billion', delta: 'Exports $264.7B, imports $233.7B', dir: 'up', source: 'BPS, 2024' }) +
    kpiCard({ label: 'Government debt', value: '39.3', unit: '% of GDP', delta: 'Below the 60% legal ceiling', dir: 'down', source: 'IMF / Ministry of Finance, 2024' }) +
    '</div>' +
    '<section class="card"><h2>Growth and size, 2015–2024</h2><p>Switch between the level of GDP and its annual growth rate.</p>' +
    '<div class="controls"><div class="seg" role="group" aria-label="Chart measure">' +
    '<button id="seg-level" aria-pressed="true">GDP level (US$ bn)</button>' +
    '<button id="seg-growth" aria-pressed="false">Growth rate (%)</button></div></div>' +
    '<div class="chart-wrap"><canvas id="ch-econ" class="chart tall"></canvas><div class="tip"></div></div>' +
    '<p class="src" id="econ-src">Source: World Bank, World Development Indicators</p></section>' +
    '<div class="grid-2">' +
    '<section class="card"><h2>What the economy makes, 2024</h2><p>Share of GDP by sector. Manufacturing is the largest single sector at 18.7%.</p>' +
    '<div class="chart-wrap"><canvas id="ch-sectors" class="chart tall"></canvas><div class="tip"></div></div>' +
    legend(D.GDP_SECTORS.slice(0, 6)) + srcLine('BPS, National Accounts 2024') + '</section>' +
    chartCard('ch-exports', 'Top exports, 2024 (US$ billion)', '<p>Coal, steel and palm oil lead exports; nickel processing keeps climbing.</p>', D.TRADE.source, true) +
    '</div>' +
    '<section class="card"><h2>Investment</h2><p>Realised investment reached <strong>Rp1,714 trillion</strong> in 2024, of which foreign direct investment was <strong>Rp900 trillion</strong> — the highest on record. The largest destinations were basic metals, transport and mining.</p>' +
    srcLine('Ministry of Investment / BKPM, 2024') + '</section>';
  return {
    html,
    mount() {
      const redrawers = [];
      let current = null;
      const drawLevel = () => {
        current = barChart(document.getElementById('ch-econ'), { labels: D.GDP_LEVEL.labels, values: D.GDP_LEVEL.values, unit: 'US$ bn' });
        document.getElementById('econ-src').textContent = 'Source: ' + D.GDP_LEVEL.source;
        return current;
      };
      const drawGrowth = () => {
        current = lineChart(document.getElementById('ch-econ'), { labels: D.GDP_GROWTH.labels, values: D.GDP_GROWTH.values, unit: '%', zeroLine: true });
        document.getElementById('econ-src').textContent = 'Source: ' + D.GDP_GROWTH.source;
        return current;
      };
      redrawers.push(drawLevel());
      const bLevel = document.getElementById('seg-level');
      const bGrowth = document.getElementById('seg-growth');
      const redrawEcon = () => { if (current) current(); };
      bLevel.addEventListener('click', () => {
        bLevel.setAttribute('aria-pressed', 'true');
        bGrowth.setAttribute('aria-pressed', 'false');
        current = drawLevel();
      });
      bGrowth.addEventListener('click', () => {
        bGrowth.setAttribute('aria-pressed', 'true');
        bLevel.setAttribute('aria-pressed', 'false');
        current = drawGrowth();
      });
      redrawers.push(redrawEcon);
      redrawers.push(donutChart(document.getElementById('ch-sectors'), { items: D.GDP_SECTORS, centerLabel: 'Manufacturing\n18.7%' }));
      redrawers.push(hBarChart(document.getElementById('ch-exports'), { items: D.TRADE.topExports, unit: 'US$ bn' }));
      return redrawers;
    },
  };
}

export function renderPrices() {
  const rows = D.CPI_GROUPS.map((g) => {
    const w = Math.min(100, Math.abs(g.value) * 14);
    return '<tr><td>' + g.label + '</td><td><span class="bar-cell"><span class="bar" style="width:' + w + '%;' + (g.value < 0 ? 'background:#b3402e' : '') + '"></span><span class="num">' + g.value.toFixed(1) + '%</span></span></td></tr>';
  }).join('');
  const html = pageHead('Prices', 'Inflation at 1.57%',
    'Consumer prices rose 1.57% in the year to December 2024 — inside Bank Indonesia’s 1.5–3.5% target band for the whole year, the calmest inflation in two decades.') +
    '<div class="kpis">' +
    kpiCard({ label: 'Inflation (Dec, yoy)', value: '1.57', unit: '%', delta: 'Down from 2.61% in Dec 2023', dir: 'down', source: 'BPS, Dec 2024' }) +
    kpiCard({ label: 'CPI index', value: '106.5', unit: '(2022 = 100)', delta: 'December 2024', dir: 'up', source: 'BPS, Dec 2024' }) +
    kpiCard({ label: 'Food inflation', value: '2.2', unit: '% yoy', delta: 'Rice eased after the harvest', dir: 'down', source: 'BPS, Dec 2024' }) +
    kpiCard({ label: 'Policy rate', value: '6.00', unit: '%', delta: 'Bank Indonesia, held since Sep 2024', dir: 'down', source: 'Bank Indonesia' }) +
    '</div>' +
    chartCard('ch-infl', 'Monthly inflation, 2024 (% year-on-year)', '<p>Inflation cooled through the year as food prices settled after Ramadan.</p>', D.INFLATION_MONTHLY.source, true) +
    '<section class="card"><h2>What got more expensive in 2024</h2><p>Price change by spending group, December 2024 on a year earlier. Personal care rose fastest; communication got cheaper.</p>' +
    '<table class="data"><thead><tr><th>Group</th><th>Change (yoy)</th></tr></thead><tbody>' + rows + '</tbody></table>' +
    srcLine('BPS, Consumer Price Index, Dec 2024') + '</section>' +
    '<div class="note"><strong>How to read it:</strong> inflation of 1.57% means a basket that cost Rp100,000 in December 2023 cost Rp101,570 in December 2024. The target band is 1.5–3.5%.</div>';
  return {
    html,
    mount() {
      return [lineChart(document.getElementById('ch-infl'), { labels: D.INFLATION_MONTHLY.labels, values: D.INFLATION_MONTHLY.values, unit: '%' })];
    },
  };
}

export function renderLabour() {
  const html = pageHead('Labour', '152.1 million at work',
    'The labour force grew to 152.1 million in August 2024. Unemployment fell to 4.76%, its lowest since 1998 — but 57.1% of workers are still informal.') +
    '<div class="kpis">' +
    kpiCard({ label: 'Labour force', value: '152.1', unit: 'million', delta: '+2.9 million on Aug 2023', dir: 'up', source: 'BPS, Aug 2024' }) +
    kpiCard({ label: 'Employed', value: '144.9', unit: 'million', delta: '95.2% of the labour force', dir: 'up', source: 'BPS, Aug 2024' }) +
    kpiCard({ label: 'Unemployment rate', value: '4.76', unit: '%', delta: 'Lowest since 1998', dir: 'down', source: 'BPS, Aug 2024' }) +
    kpiCard({ label: 'Average wage', value: 'Rp3.31', unit: 'million / month', delta: '+2.8% on Aug 2023', dir: 'up', source: 'BPS, Aug 2024' }) +
    '</div>' +
    '<div class="grid-2">' +
    '<section class="card"><h2>Where Indonesians work</h2><p>Share of employment by sector, August 2024. Agriculture still employs more people than any other sector.</p>' +
    '<div class="chart-wrap"><canvas id="ch-lab-sectors" class="chart tall"></canvas><div class="tip"></div></div>' +
    legend(D.LABOUR.bySector) + srcLine('BPS, Sakernas Aug 2024') + '</section>' +
    '<section class="card"><h2>Informal work</h2><p><strong>57.1%</strong> of all workers — about 82.7 million people — work informally: own-account workers, unpaid family workers and casual labourers without contracts or social security.</p>' +
    '<p>Informality is highest in agriculture (over 80%) and lowest in manufacturing and finance. The government’s target is to bring it below 50% by 2029.</p>' +
    '<h3>Minimum wages</h3><p>The Jakarta provincial minimum wage for 2025 is <strong>Rp5,396,761</strong> a month; the lowest provincial minimum is in Central Java at Rp2,169,349.</p>' +
    srcLine('BPS, Sakernas Aug 2024; provincial wage decrees, 2025') + '</section>' +
    '</div>' +
    '<section class="card"><h2>Youth unemployment</h2><p>Unemployment among 15–24 year olds was <strong>16.9%</strong> in August 2024 — more than three times the national rate. One in five young people was not in employment, education or training (NEET).</p>' +
    srcLine('BPS, Sakernas Aug 2024') + '</section>';
  return {
    html,
    mount() {
      return [donutChart(document.getElementById('ch-lab-sectors'), { items: D.LABOUR.bySector, centerLabel: 'Agriculture\n27.9%' })];
    },
  };
}

export function renderRegions() {
  const topGrpd = [...D.PROVINCES].sort((a, b) => b.grdp - a.grdp).slice(0, 8);
  const html = pageHead('Regions', 'Compare the 38 provinces',
    'From Jakarta’s Rp278 million of output per person to Papua’s 34.1% poverty rate — search a province or sort the table to see how Indonesia’s regions differ.') +
    '<div class="controls"><input type="search" id="region-search" placeholder="Search a province…" aria-label="Search provinces">' +
    '<span class="muted small" id="region-count"></span></div>' +
    '<section class="card"><h2>Provinces</h2>' +
    '<div class="table-scroll"><table class="data" id="regions-table"><thead><tr>' +
    '<th class="sortable" data-key="name">Province</th><th class="sortable" data-key="pop">Population (m)</th>' +
    '<th class="sortable" data-key="grdp">GRDP / capita (Rp m)</th><th class="sortable" data-key="hdi">HDI</th>' +
    '<th class="sortable" data-key="poverty">Poverty (%)</th></tr></thead><tbody></tbody></table></div>' +
    srcLine('BPS, 2024. Fifteen largest provinces shown; the full 38-province table is in the printed yearbook.') + '</section>' +
    chartCard('ch-grdp', 'Output per person, top 8 provinces (Rp million)', '<p>Resource-rich East Kalimantan and Riau, and Jakarta, lead on output per person.</p>', 'BPS, 2024', true);
  return {
    html,
    mount() {
      const redrawers = [];
      redrawers.push(hBarChart(document.getElementById('ch-grdp'), { items: topGrpd.map((p) => ({ label: p.name, value: p.grdp })), unit: 'Rp m' }));
      const table = document.getElementById('regions-table');
      const search = document.getElementById('region-search');
      const count = document.getElementById('region-count');
      let data = [...D.PROVINCES].sort((a, b) => b.pop - a.pop);
      let sortKey = 'pop';
      let asc = false;
      let query = '';
      const paint = () => {
        const rows = data.filter((p) => p.name.toLowerCase().includes(query));
        table.querySelector('tbody').innerHTML = rows.map((p) =>
          '<tr><td>' + p.name + '</td><td class="num">' + p.pop.toFixed(1) + '</td>' +
          '<td class="num">' + p.grdp.toFixed(1) + '</td><td class="num">' + p.hdi.toFixed(3) + '</td>' +
          '<td class="num">' + p.poverty.toFixed(1) + '%</td></tr>').join('');
        count.textContent = rows.length + ' of ' + D.PROVINCES.length + ' provinces shown';
      };
      table.querySelectorAll('th.sortable').forEach((th) => {
        th.addEventListener('click', () => {
          const key = th.dataset.key;
          if (sortKey === key) asc = !asc; else { sortKey = key; asc = key === 'name'; }
          data.sort((a, b) => {
            const av = a[key];
            const bv = b[key];
            if (typeof av === 'string') return asc ? av.localeCompare(bv) : bv.localeCompare(av);
            return asc ? av - bv : bv - av;
          });
          paint();
        });
      });
      search.addEventListener('input', () => { query = search.value.trim().toLowerCase(); paint(); });
      paint();
      return redrawers;
    },
  };
}

export function renderAbout() {
  const html = pageHead('About NusaStat', 'Where the numbers come from',
    'NusaStat publishes Indonesia’s official statistics in one place. Every figure on this site names its source and year — nothing is estimated by us, and nothing is shown without a source.') +
    '<section class="card"><h2>Sources</h2><div class="table-scroll"><table class="data"><thead><tr><th>Source</th><th>What it provides</th></tr></thead><tbody>' +
    D.SOURCES.map((s) => '<tr><td>' + s.name + '</td><td>' + s.what + '</td></tr>').join('') +
    '</tbody></table></div>' +
    '<p class="src">Full citations, including publication numbers, are in the printed Statistical Yearbook of Indonesia 2025.</p></section>' +
    '<section class="card"><h2>How the figures are made</h2>' +
    '<p><strong>Population</strong> comes from the 2020 Census and annual projections. <strong>GDP</strong> is compiled from establishment surveys and administrative records, in current and constant 2010 prices. <strong>Inflation</strong> is the Consumer Price Index from price surveys in 90 cities. <strong>Labour</strong> figures come from the National Labour Force Survey (Sakernas), run twice a year. <strong>Poverty</strong> is measured against a poverty line of basic food and non-food needs, updated every March and September.</p>' +
    '<p>Figures are revised when better data arrives; the latest release always supersedes earlier ones, and revisions are flagged on the release page.</p></section>' +
    '<section class="card"><h2>Release calendar</h2><ul class="release-list">' +
    D.RELEASES.map((r) => '<li><span>' + r.title + '</span><span class="date">' + r.date + '</span></li>').join('') +
    '</ul>' + srcLine('All releases at 08:00 Western Indonesia Time') + '</section>' +
    '<div class="note"><strong>A note on this site:</strong> NusaStat is an original demonstration of a national statistics site, built for the make.fun bounty. It is not affiliated with Statistics Indonesia (BPS) or any government agency, and its figures are the published headline statistics cited above.</div>';
  return { html, mount() { return []; } };
}
