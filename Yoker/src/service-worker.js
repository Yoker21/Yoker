const CACHE_NAME = 'yoker-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/src/css/styles.css',
    '/src/js/main.js',
    '/README.md'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (key !== CACHE_NAME) return caches.delete(key);
            })
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const request = event.request;

    // For navigation requests, try network first then cache
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).then(res => {
                const clone = res.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                return res;
            }).catch(() => caches.match('/index.html'))
        );
        return;
    }

    // For other requests, use cache-first strategy
    event.respondWith(
        caches.match(request).then(cached => cached || fetch(request).then(res => {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
            return res;
        })).catch(() => {
            // fallback to cached index
            return caches.match('/index.html');
        })
    );
});
