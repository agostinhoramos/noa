self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("statics").then(cache => {
            return cache.addAll([
                "/",
                "/img/noa.png",
                "/static/main.js",
                "/vendor/tailwindcss/index.css",
                "/vendor/jquery/jquery.js",
                "/static/style.css"
            ]);
        })
    );
});

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );
});
