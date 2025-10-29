const CACHE_VERSION = 'v64'; // ФИНАЛЬНОЕ обновление: агрессивное удаление всех элементов <p> и других с PRODUCTION
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;
const PRECACHE = `precache-${CACHE_VERSION}`;

// Предкешируем «оболочку» приложения
const ASSETS = [
  '/pwa-app-debug/',
  '/pwa-app-debug/index.html',
  '/pwa-app-debug/styles.css',
  '/pwa-app-debug/app.js',
  '/pwa-app-debug/manifest.webmanifest',
  '/pwa-app-debug/assets/icons/icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => {
        if (![PRECACHE, RUNTIME_CACHE].includes(key)) return caches.delete(key);
      }));
      await self.clients.claim();
      
      // Принудительно обновляем все клиенты
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({ type: 'SW_UPDATED' });
      });
      
      // Дополнительная проверка через 1 секунду
      setTimeout(async () => {
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
          client.postMessage({ type: 'FORCE_RELOAD' });
        });
      }, 1000);
    })()
  );
});

// Слушаем сообщения от клиентов
self.addEventListener('message', (event) => {
  const msg = event.data || {};
  if (msg.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }
  if (msg.type === 'CHECK_UPDATE') {
    // Принудительно обновляем кэш предзагруженных ресурсов
    event.waitUntil(
      caches.open(PRECACHE).then(cache => cache.addAll(ASSETS))
    );
  }
});

// Стратегии кэширования
function isHtmlRequest(request){
  return request.mode === 'navigate' ||
         (request.headers.get('accept') || '').includes('text/html');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // Для навигации: сначала сеть, затем кэш с фолбэком на index.html
  if (isHtmlRequest(request)) {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, response.clone());
        return response;
      } catch {
        const cache = await caches.open(PRECACHE);
        return (await cache.match('/pwa-app-debug/index.html')) || Response.error();
      }
    })());
    return;
  }

  // Для статических файлов: сначала кэш, потом сеть с докешированием
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
      return response;
    } catch {
      // Нет сети и нет в кэше
      return Response.error();
    }
  })());
});


