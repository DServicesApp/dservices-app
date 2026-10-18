const CACHE_NAME = "dservices-cache-v2";


const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json"
];


// HIFADHI MAFAYLI MUHIMU
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});


// WASHIRIKISHA SERVICE WORKER MPYA
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names
          .filter(name =>
            name.startsWith("dservices-cache-") &&
            name !== CACHE_NAME
          )
          .map(name => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});


// TUMIA CACHE BILA DATA
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);


  if (url.origin !== self.location.origin) return;


  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request)
          .then(response => {
            return response;
          })
          .catch(() => {
            if (event.request.mode === "navigate") {
              return caches.match("./index.html");
            }
            return new Response("Hakuna mtandao.", {
              status: 503,
              headers: {
                "Content-Type": "text/plain; charset=utf-8"
              }
            });
          });
      })
  );
});
