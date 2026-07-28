/* Offline layer for the honeymoon guide.
   Content updates need no version bump (navigations are network-first);
   bump CACHE only when the precache list itself changes. */
var CACHE = 'hm-v1';
var CORE = [
  './',
  './manifest.webmanifest',
  './images/hero.jpg',
  './images/city-milan.jpg',
  './images/city-florence.jpg',
  './images/city-positano.jpg',
  './images/city-capri.jpg',
  './images/city-rome.jpg',
  './images/hotel-milan.jpg',
  './images/hotel-florence.jpg',
  './images/hotel-positano.jpg',
  './images/hotel-capri.jpg',
  './images/icon-192.png',
  './images/icon-512.png',
  './images/apple-touch-icon.png'
];
var EXT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'upload.wikimedia.org'];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  // The page itself: always try the network (so published updates land),
  // fall back to the cached copy when offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put('./', copy); });
        return res;
      }).catch(function () { return caches.match('./'); })
    );
    return;
  }

  // Same-origin assets + fonts + the one wikimedia image:
  // serve from cache instantly, refresh in the background.
  var sameOrigin = url.origin === location.origin;
  if (!sameOrigin && EXT_HOSTS.indexOf(url.hostname) === -1) return; // e.g. Google Maps embed: never intercept

  e.respondWith(
    caches.match(req).then(function (cached) {
      var fresh = fetch(req).then(function (res) {
        if (res && (res.ok || res.type === 'opaque')) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return cached; });
      return cached || fresh;
    })
  );
});
