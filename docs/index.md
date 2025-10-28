# Developer Documentation

Welcome to the documentation for the PWA Shift Manager. This guide covers the app’s public APIs, internal functions, UI components, service worker behavior, and the persistent state schema. Each section provides examples and usage notes.

- [Public API surface](./public-api.md)
- [Application functions reference](./app-functions.md)
- [UI structure and components](./ui-components.md)
- [Service Worker](./service-worker.md)
- [Application state schema](./state.md)

## Quick start
- Install deps and run: `npm start`
- Open: `http://localhost:3000/`
- The app is a client-side PWA; data is stored in `localStorage`.

## Conventions
- Dates use `YYYY-MM-DD` format.
- Shift types: `D` (Day), `N` (Night), `O` (Off).
- Time values are minutes unless stated otherwise.
