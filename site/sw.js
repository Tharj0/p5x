/* Service worker del sito P5X: tiene in cache pagine, guide e immagini perché il sito si apra anche offline.
   Le chiamate all'API di GitHub (sincronizzazione dati) non passano mai dalla cache.
   __VERSION__ e __CORE__ vengono sostituiti da tools/build_site.py a ogni build. */
'use strict';
const CACHE = 'p5x-__VERSION__';
const CORE = __CORE__;

self.addEventListener('install', ev => {
  ev.waitUntil(caches.open(CACHE)
    .then(c => Promise.all(CORE.map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => null))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', ev => {
  ev.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith('p5x-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', ev => {
  const req = ev.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;           // api.github.com, lufel.net…: sempre dalla rete
  const page = req.mode === 'navigate' || /\.(html?|webmanifest)$/.test(url.pathname) || url.pathname.endsWith('/');
  ev.respondWith(page ? networkFirst(req) : cacheFirst(req));
});

// pagine: prima la rete (versione più recente), la cache se offline o se la rete è lenta
async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  const net = fetch(req).then(res => { if (res && res.ok) cache.put(req, res.clone()).catch(() => {}); return res; });
  try {
    return await Promise.race([net, new Promise((_, rej) => setTimeout(() => rej(new Error('lenta')), 4000))]);
  } catch (e) {
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try { return await net; } catch (e2) {
      return (await cache.match(new URL('index.html', self.registration.scope).href)) || Response.error();
    }
  }
}
// immagini, css, js: dalla cache (rinnovata a ogni nuova versione del sito)
async function cacheFirst(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req, { ignoreSearch: true });
  if (hit) return hit;
  try { const res = await fetch(req); if (res && res.ok) cache.put(req, res.clone()).catch(() => {}); return res; }
  catch (e) { return Response.error(); }
}
