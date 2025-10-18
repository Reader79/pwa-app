# Service Worker

The Service Worker provides offline support, update signaling, and basic caching strategies.

- Cache version: `v59`
- Precache name: `precache-v59`
- Runtime cache name: `runtime-v59`

## Pre-cached assets
```text
/pwa-app/
/pwa-app/index.html
/pwa-app/styles.css
/pwa-app/app.js
/pwa-app/manifest.webmanifest
/pwa-app/assets/icons/icon.svg
```
Ensure these paths match your deployment base path (e.g., GitHub Pages). If you host at the root, update the paths accordingly.

## Lifecycle

### install
- Opens the precache and adds all assets
- Calls `self.skipWaiting()` to activate the new SW ASAP

### activate
- Deletes old caches not matching current names
- Claims clients via `self.clients.claim()`
- Broadcasts `{ type: 'SW_UPDATED' }` immediately to all clients
- Sends `{ type: 'FORCE_RELOAD' }` ~1 second later as a follow-up

### message
- Accepts `{ type: 'CHECK_UPDATE' }` to re-add pre-cache assets (best-effort refresh)

Client example:
```js
if (navigator.serviceWorker?.controller) {
  navigator.serviceWorker.controller.postMessage({ type: 'CHECK_UPDATE' });
}
```

## Fetch handling

### HTML navigations
Network-first with cache fallback to `index.html`:
1. Try `fetch(request)`.
2. On success, put the response into the runtime cache and return it.
3. On failure, fall back to the precached `/pwa-app/index.html`.

### Static assets and other GETs
Cache-first with network fallback and backfill:
1. Try `caches.match(request)`.
2. If missing, fetch from network, clone into runtime cache, and return.

## Helper utilities
- `isHtmlRequest(request)`: Detects navigation/HTML requests via mode/Accept header.

## Forcing updates
The client already listens to SW messages and reloads when updates are detected on page load or periodically every 30s. You can also manually request an asset refresh via `CHECK_UPDATE` as shown above.
