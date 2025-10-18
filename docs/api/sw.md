# Service Worker API — sw.js

Service Worker обеспечивает офлайн-режим и обновления.

## Константы
- `CACHE_VERSION`: семвер-метка версии кэша (строка)
- `RUNTIME_CACHE`: имя runtime-кэша
- `PRECACHE`: имя кэша предзагрузки
- `ASSETS`: список путей для предкеширования (оболочка приложения)

## События жизненного цикла
- `install`: открывает `PRECACHE` и добавляет `ASSETS`, затем `skipWaiting()`
- `activate`: удаляет старые кэши, `clients.claim()`, уведомляет клиентов `SW_UPDATED` и через 1с шлет `FORCE_RELOAD`

## Сообщения
- `message`: если `{ type: 'CHECK_UPDATE' }`, повторно добавляет `ASSETS` в `PRECACHE`

## Fetch-стратегии
- HTML-навигация: network-first с фолбэком на `index.html` из `PRECACHE`
- Прочие GET-запросы: cache-first с докешированием ответа

## Примеры
```js
// Запросить проверку обновлений из клиентов
navigator.serviceWorker.controller?.postMessage({ type: 'CHECK_UPDATE' });
```
