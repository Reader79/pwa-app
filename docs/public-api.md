# Public API Surface

This application is a client-side PWA. Most logic is internal, but a few programmatic entry points are exposed, and the Service Worker provides a small message API.

- Runtime environment: Browser (no bundler/module system)
- Persistence: `localStorage`
- Global namespace: only minimal APIs are exposed on `window`

## Programmatic globals (window)

### `window.removeEntry(index: number): void`
Removes an unsaved entry from the in-dialog list while creating/editing a daily record. This does NOT touch persisted records.

- Side effects: Mutates in-memory `currentEntries` and re-renders the list; hides the list if empty
- Typical usage: automatically called by UI buttons rendered in the "Add record" dialog

Example (DevTools Console):
```js
// Remove the first unsaved row while the add/edit dialog is open
window.removeEntry(0)
```

### `window.editEntry(date: string, entryIndex: number): void`
Loads an existing persisted record entry for a given `date` (YYYY-MM-DD), pre-fills the add/edit dialog in edit mode, and opens it.

- Side effects: Sets internal edit mode, populates form fields, calls `openAddRecordDialog(date, true)`
- Postconditions: The dialog is open; on Save, the edited entry replaces the old one

Example:
```js
// Edit the first entry on 2025-10-12
window.editEntry('2025-10-12', 0)
```

### `window.deleteEntry(date: string, entryIndex: number): void`
Deletes a persisted entry by index for the specified date. If the record becomes empty, the entire day record is removed.

- Side effects: Persists state to `localStorage`, re-renders calendar and results
- Confirmation: Prompts the user via `confirm()` before deletion

Example:
```js
// Delete the first entry on 2025-10-12 (shows confirmation dialog)
window.deleteEntry('2025-10-12', 0)
```

## Service Worker messaging API

The Service Worker listens for messages from client pages.

### Post message types the SW accepts
- `{ type: 'CHECK_UPDATE' }`: Forces the SW to re-add all pre-cache assets (best-effort refresh of the current cache set).

Example:
```js
if (navigator.serviceWorker?.controller) {
  navigator.serviceWorker.controller.postMessage({ type: 'CHECK_UPDATE' });
}
```

### Messages the SW sends to clients
- `{ type: 'SW_UPDATED' }`: Broadcast after activation to ask clients to refresh.
- `{ type: 'FORCE_RELOAD' }`: Sent ~1s after activation as a follow-up to ensure all tabs refresh.

Client example handler (already wired in `app.js`):
```js
navigator.serviceWorker.addEventListener('message', (event) => {
  if (event.data?.type === 'SW_UPDATED' || event.data?.type === 'FORCE_RELOAD') {
    window.location.reload();
  }
});
```

## Persistent storage keys
- Primary state key: `pwa-settings-v1` (used by normal load/save paths)
- Import routine key: `pwa-state` (used only by the import path)

Note: After importing, the UI calls `hydrateMain()`/renderers so the app state reflects imported data even though the key differs.

## Event-driven UI API
While most features are driven by UI interactions, you can trigger flows programmatically by dispatching clicks on the existing buttons (when present in DOM):

```js
// Open the data entry dialog via the home action
document.getElementById('actionOne')?.click();

// Open reports dialog
document.getElementById('actionTwo')?.click();
```

## Versioning and base path
- SW cache version string: `v59`
- Precache assumes base path `/pwa-app/` (adjust for hosting if the path differs)
