// NusaStat bootstrap: hash router + page render + mobile menu.
// Routes: #/ overview, #/population, #/economy, #/prices, #/labour,
// #/social, #/data, #/about. Anything else shows a tidy not-found page.
// window.__shotReady is false while a page renders and true once it is
// on screen, so screenshots can wait for it.

import {
  viewOverview, viewPopulation, viewEconomy, viewPrices, viewLabour,
  viewSocial, viewExplorer, viewAbout, viewNotFound, bindPage,
} from './views.js';

// In-memory UI state only — no storage, no cookies, no network.
const ui = {
  popChart: 'line',
  popRange: 10,
  provSearch: '',
  provSortKey: 'population',
  provSortDir: 'desc',
  exQuery: '',
  exTopic: 'All',
  exSortKey: '',
  exSortDir: 'asc',
};

const TITLES = {
  '': 'NusaStat — National Statistics Portal of Indonesia',
  population: 'Population — NusaStat',
  economy: 'Economy — NusaStat',
  prices: 'Prices & Inflation — NusaStat',
  labour: 'Labour — NusaStat',
  social: 'Social — NusaStat',
  data: 'Data Explorer — NusaStat',
  about: 'About & Sources — NusaStat',
};

const pageEl = document.getElementById('page');
const navEl = document.getElementById('main-nav');
const toggleEl = document.getElementById('nav-toggle');

function currentRoute() {
  const hash = window.location.hash || '#/';
  return hash.replace(/^#\/?/, '').split('?')[0].split('/')[0];
}

function renderPage() {
  window.__shotReady = false;
  const route = currentRoute();
  let html;
  if (route === '') html = viewOverview();
  else if (route === 'population') html = viewPopulation(ui);
  else if (route === 'economy') html = viewEconomy();
  else if (route === 'prices') html = viewPrices();
  else if (route === 'labour') html = viewLabour();
  else if (route === 'social') html = viewSocial();
  else if (route === 'data') html = viewExplorer(ui);
  else if (route === 'about') html = viewAbout();
  else html = viewNotFound(route);

  document.title = TITLES[route] || 'Page not found — NusaStat';
  pageEl.innerHTML = html;
  navEl.querySelectorAll('a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('data-route') === route);
  });
  bindPage(pageEl, route, ui, renderPage);
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

toggleEl.addEventListener('click', () => {
  const open = navEl.classList.toggle('open');
  toggleEl.setAttribute('aria-expanded', String(open));
  toggleEl.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

navEl.addEventListener('click', (event) => {
  if (event.target.tagName === 'A') navEl.classList.remove('open');
});

window.addEventListener('hashchange', renderPage);

window.__shotReady = false;
renderPage();
