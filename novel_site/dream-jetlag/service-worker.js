
const CACHE_NAME = '《夢境時差：七封謎信》-v1';
const urlsToCache = [
    "./index.html",
    "chapter_chapter00.html",
    "chapter_chapter01.html",
    "chapter_chapter01-1.html",
    "chapter_chapter01-2.html",
    "chapter_chapter02.html",
    "chapter_chapter02-1.html",
    "chapter_chapter02-2.html",
    "chapter_chapter03.html",
    "chapter_chapter03-1.html",
    "chapter_chapter03-2.html",
    "chapter_chapter03-3.html",
    "chapter_chapter03-4.html",
    "chapter_chapter04.html",
    "chapter_chapter04-1.html",
    "chapter_chapter04-2.html",
    "chapter_chapter04-3.html",
    "chapter_chapter04-4.html",
    "chapter_chapter05.html",
    "chapter_chapter05-1.html",
    "chapter_chapter05-2.html",
    "chapter_chapter05-3.html",
    "chapter_chapter05-4.html",
    "chapter_chapter05-5.html",
    "chapter_chapter05-6.html",
    "chapter_chapter06.html",
    "chapter_chapter06-1.html",
    "chapter_chapter06-2.html",
    "chapter_chapter06-3.html",
    "chapter_chapter06-4.html",
    "chapter_chapter06-5.html",
    "chapter_chapter06-6.html",
    "chapter_chapter06-7.html",
    "chapter_chapter06-8.html",
    "chapter_chapter06-9.html",
    "letter_letter1.html",
    "letter_letter2.html",
    "letter_letter3.html",
    "letter_letter4.html",
    "cover.jpg",
    "icon-192x192.png",
    "icon-512x512.png"
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
