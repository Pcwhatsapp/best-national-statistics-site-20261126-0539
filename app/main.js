// NusaStat router: hash routes for every section, each reached by a link.
// The nav highlights the current section; charts redraw on window resize.

import { renderHome, renderPopulation, renderEconomy, renderPrices, renderLabour, renderRegions, renderAbout } from './views.js';
import { redrawAll } from './charts.js';

const ROUTES = {
  home: renderHome,
  population: renderPopulation,
  economy: renderEconomy,
  prices: renderPrices,
  labour: renderLabour,
  regions: renderRegions,
  about: renderAbout,
};

const app = document.getElementById('app');
let redrawers = [];
let resizeTimer = 0;

window.addEventListener('resize', () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => redrawAll(redrawers), 120);
});

function routeFromHash() {
  const hash = window.location.hash.replace(/^#\/?/, '').split('/')[0];
  return ROUTES[hash] ? hash : 'home';
}

function render() {
  const route = routeFromHash();
  const view = ROUTES[route]();
  app.innerHTML = view.html;
  document.querySelectorAll('[data-nav]').forEach((a) => {
    a.classList.toggle('active', a.dataset.nav === route);
  });
  redrawers = view.mount();
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
