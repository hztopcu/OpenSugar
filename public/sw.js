// OpenSugar – minimal service worker for PWA "Add to Home Screen"
const CACHE = "opensugar-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Network-first; no offline cache for dynamic data
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
