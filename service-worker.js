const CACHE_NAME = "dservices-cache-v1";

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json"
];

// Hifadhi mafaili muhimu ya app
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(APP_FILES);
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
});

// Tumia cache na safisha matoleo ya zamani
self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names
          .filter(function(name) {
            return name.startsWith("dservices-cache-") &&
                   name !== CACHE_NAME;
          })
          .map(function(name) {
            return caches.delete(name);
          })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fungua mafaili yaliyohifadhiwa ikiwa mtandao haupo
self.addEventListener("fetch", function(event) {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(function(cachedResponse) {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).catch(function() {
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }

        return new Response("Hakuna mtandao.", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
      });
    })
  );
});
