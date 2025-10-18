# PWA Shift Manager - Developer Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Development Setup](#development-setup)
3. [Project Structure](#project-structure)
4. [Architecture Overview](#architecture-overview)
5. [Code Conventions](#code-conventions)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Contributing](#contributing)
9. [Troubleshooting](#troubleshooting)

---

## Introduction

This guide is for developers who want to contribute to, customize, or understand the internals of the PWA Shift Manager application.

### Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 with CSS Custom Properties
- **Storage**: LocalStorage API
- **PWA**: Service Worker, Web App Manifest
- **Build**: None (no bundler required)
- **Deployment**: Static hosting (GitHub Pages)

### Key Design Decisions

1. **No Build Step**: To keep it simple and maintainable
2. **Vanilla JS**: No framework dependencies
3. **LocalStorage**: Simple persistence without backend
4. **Service Worker**: Offline-first architecture
5. **Russian Language**: Target audience is Russian-speaking operators

---

## Development Setup

### Prerequisites

- Node.js 14+ (for http-server only)
- Modern browser (Chrome 80+, Firefox 75+, Safari 13.1+)
- Text editor (VS Code recommended)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Reader79/pwa-app.git
cd pwa-app

# Install dependencies (optional, for development server)
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:3000`.

### Alternative: No Install Setup

You can also develop without npm:

```bash
# Using Python 3
python -m http.server 3000

# Using PHP
php -S localhost:3000

# Or simply open index.html in browser
# (Service Worker won't work with file:// protocol)
```

### Recommended VS Code Extensions

- **ESLint**: JavaScript linting
- **Prettier**: Code formatting
- **Live Server**: Auto-reload during development
- **GitLens**: Git integration
- **Error Lens**: Inline error display

---

## Project Structure

```
pwa-app/
├── index.html              # Main HTML file
├── app.js                  # Application logic (1850 lines)
├── styles.css              # Styling (980 lines)
├── sw.js                   # Service Worker (100 lines)
├── manifest.webmanifest    # PWA manifest
├── package.json            # NPM configuration
├── README.md               # Project overview
├── API_DOCUMENTATION.md    # API reference
├── USER_GUIDE.md           # User manual (Russian)
├── DEVELOPER_GUIDE.md      # This file
└── assets/
    └── icons/
        └── icon.svg        # Application icon
```

### File Responsibilities

#### `index.html`
- Semantic HTML5 structure
- Dialog elements for modals
- No inline JavaScript
- References external CSS and JS

#### `app.js`
- State management
- Event handlers
- UI rendering
- Calendar logic
- Report generation
- Import/export functionality
- Service Worker registration

#### `styles.css`
- CSS Custom Properties (theme)
- Responsive design
- Component styles
- Print styles

#### `sw.js`
- Service Worker lifecycle
- Caching strategies
- Offline support
- Update mechanism

#### `manifest.webmanifest`
- PWA metadata
- Icon definitions
- Display mode
- Theme colors

---

## Architecture Overview

### Application Flow

```
User Opens App
    ↓
index.html loads
    ↓
Load styles.css
    ↓
Load app.js
    ↓
DOMContentLoaded event
    ↓
loadState() from localStorage
    ↓
Initialize UI components
    ↓
Bind event handlers
    ↓
Register Service Worker
    ↓
Application ready
```

### State Management

```javascript
// Global state object
let state = {
  main: { operatorName, shiftNumber, baseTime },
  machines: [...],
  parts: [{id, name, operations: [...]}],
  records: [{id, date, shiftType, entries: [...]}]
};

// Persistence
localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
```

**State Flow**:
1. User action triggers event
2. Event handler modifies state
3. `saveState()` persists to localStorage
4. UI re-renders affected components

### Component Architecture

The application uses a component-based approach without a framework:

```
App
├── Header
│   ├── Title
│   └── Settings Button
├── Main Content
│   └── Action Buttons (3)
└── Dialogs
    ├── Settings Dialog
    │   ├── Tabs (Main, Machines, Parts, Export)
    │   └── Tab Panels
    ├── Calendar Dialog
    │   ├── Navigation
    │   ├── Calendar Grid
    │   ├── Add Record Button
    │   └── Results Section
    ├── Add Record Dialog
    ├── Reports Dialog
    └── Operations Dialog
```

### Data Flow Diagram

```
┌──────────────────────────────────────────┐
│           User Interface                 │
│  (HTML Elements + Event Listeners)       │
└──────────────┬───────────────────────────┘
               │
               │ User Actions
               ↓
┌──────────────────────────────────────────┐
│        Event Handlers (app.js)           │
│  - Click handlers                        │
│  - Input handlers                        │
│  - Form submission handlers              │
└──────────────┬───────────────────────────┘
               │
               │ Modify State
               ↓
┌──────────────────────────────────────────┐
│      Global State Object                 │
│  { main, machines, parts, records }      │
└──────────────┬───────────────────────────┘
               │
               │ saveState()
               ↓
┌──────────────────────────────────────────┐
│         localStorage                     │
│  Key: 'pwa-settings-v1'                  │
└──────────────────────────────────────────┘
```

---

## Code Conventions

### JavaScript Style Guide

#### Naming Conventions

```javascript
// Variables and functions: camelCase
const machinesList = [];
function renderCalendar() {}

// Constants: UPPER_SNAKE_CASE
const STORAGE_KEY = 'pwa-settings-v1';
const CACHE_VERSION = 'v59';

// Classes: PascalCase (if added in future)
class RecordManager {}

// Private/internal: prefix with underscore
function _internalHelper() {}
```

#### Function Organization

```javascript
// 1. State management functions
function loadState() {}
function saveState() {}

// 2. UI rendering functions
function renderMachines() {}
function renderParts() {}
function renderCalendar() {}

// 3. Event handlers
function bindMain() {}
addMachine?.addEventListener('click', () => {});

// 4. Utility functions
function formatDate() {}
function calculateTotalTime() {}

// 5. Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Setup code
});
```

#### Comments

```javascript
// Single-line comments for brief explanations
const baseTime = 600; // 10 hours in minutes

/**
 * Multi-line JSDoc comments for functions
 * @param {Date} date - The date to check
 * @returns {String} - Shift type ('D', 'N', or 'O')
 */
function getShiftType(date) {
  // Implementation
}

// Section dividers
// ==================
// Calendar Functions
// ==================
```

#### Error Handling

```javascript
// Always handle errors in async operations
try {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  return data;
} catch (error) {
  console.error('Failed to load state:', error);
  return defaultState;
}

// Validate user input
if (!recordMachine.value) {
  alert('Machine is required');
  return;
}

// Provide fallbacks
const name = inputValue || 'Unnamed';
const time = parseInt(timeInput.value) || 0;
```

#### Code Organization

```javascript
// Group related functionality
const CalendarModule = {
  render() {},
  navigate(direction) {},
  selectDate(date) {},
  getShiftType(date) {}
};

// Or use IIFE for encapsulation
(function CalendarModule() {
  let currentDate = new Date();
  
  function render() {
    // Private implementation
  }
  
  // Expose public API
  window.Calendar = { render };
})();
```

### CSS Conventions

#### Custom Properties

```css
:root {
  /* Colors */
  --bg: #0a0a0a;
  --text: #f8fafc;
  --primary: #6366f1;
  
  /* Spacing */
  --spacing-sm: 8px;
  --spacing-md: 16px;
  
  /* Typography */
  --font-size-base: 16px;
  
  /* Borders */
  --border-radius: 16px;
}
```

#### Class Naming (BEM-inspired)

```css
/* Block */
.calendar {}

/* Element */
.calendar__cell {}
.calendar__header {}

/* Modifier */
.calendar__cell--today {}
.calendar__cell--selected {}

/* State */
.calendar--loading {}
.dialog.is-open {}
```

#### Responsive Design

```css
/* Mobile first approach */
.button {
  padding: 12px 16px;
  font-size: 14px;
}

/* Tablet */
@media (min-width: 640px) {
  .button {
    padding: 16px 20px;
  }
}

/* Desktop */
@media (min-width: 960px) {
  .button {
    padding: 20px 24px;
  }
}
```

### HTML Conventions

```html
<!-- Semantic HTML5 -->
<header class="app-header">
  <h1 class="app-title">Смена+</h1>
</header>

<main class="app-main">
  <div class="button-grid">
    <!-- Content -->
  </div>
</main>

<!-- Accessibility -->
<button 
  class="icon-button" 
  id="settingsButton" 
  aria-label="Открыть настройки"
  title="Настройки">
  <svg aria-hidden="true">...</svg>
</button>

<!-- Dialog element -->
<dialog id="settingsDialog" aria-labelledby="settingsTitle">
  <h2 id="settingsTitle">Настройки</h2>
  <!-- Content -->
</dialog>
```

---

## Testing

### Manual Testing Checklist

#### Setup Phase
- [ ] First launch: Default state loads correctly
- [ ] Settings: All fields save and persist
- [ ] Machines: Add, edit, delete operations work
- [ ] Parts: Add, edit operations, delete works
- [ ] Operations: All fields update correctly

#### Calendar Phase
- [ ] Calendar renders current month
- [ ] Navigation works (prev/next month)
- [ ] Shift colors correct for your shift number
- [ ] Holidays show red corner
- [ ] Today's date highlighted
- [ ] Click selects date

#### Record Entry Phase
- [ ] Dialog opens on date selection
- [ ] Shift type displays correctly
- [ ] Dropdowns populated from state
- [ ] Time auto-fills from operation
- [ ] Total time calculates correctly
- [ ] Save creates/updates record
- [ ] Edit loads existing entry
- [ ] Delete removes entry

#### Reports Phase
- [ ] All 6 report types generate
- [ ] Data accurate for selected month
- [ ] Empty months show appropriate message
- [ ] Month selector works

#### Import/Export Phase
- [ ] Export downloads valid JSON
- [ ] Import accepts valid file
- [ ] Import rejects invalid file
- [ ] Data matches after import

#### PWA Features
- [ ] Service Worker registers
- [ ] App works offline
- [ ] Install prompt appears
- [ ] Installed app opens correctly

### Testing Script

```javascript
// Add to browser console for quick testing

// Test state management
console.log('Current state:', state);
console.log('Storage:', localStorage.getItem('pwa-settings-v1'));

// Test calculations
console.log('Total time:', calculateTotalTime(15, 5, 10)); // Should be 200
console.log('Coefficient:', calculateCoefficient(650, 600)); // Should be 1.08

// Test shift calculation
const testDate = new Date('2025-10-15');
console.log('Shift type:', getShiftType(testDate)); // Check against calendar

// Test data validation
console.log('Holiday check:', isHoliday(new Date('2025-01-01'))); // true
console.log('Holiday check:', isHoliday(new Date('2025-10-15'))); // false

// Stress test: Generate many records
for (let i = 1; i <= 100; i++) {
  state.records.push({
    id: `test-${i}`,
    date: `2025-10-${String(i % 31 + 1).padStart(2, '0')}`,
    shiftType: 'D',
    entries: [{
      machine: 'Test',
      part: 'Test Part',
      operation: 'Test Op',
      machineTime: 10,
      extraTime: 2,
      quantity: 5,
      totalTime: 60
    }]
  });
}
saveState();
console.log('Added 100 test records');
```

### Browser Testing Matrix

| Browser | Version | Desktop | Mobile | Status |
|---------|---------|---------|--------|--------|
| Chrome  | 80+     | ✅      | ✅     | Full support |
| Firefox | 75+     | ✅      | ✅     | Full support |
| Safari  | 13.1+   | ✅      | ✅     | Full support |
| Edge    | 80+     | ✅      | ✅     | Full support |

### Performance Testing

```javascript
// Measure render performance
console.time('renderCalendar');
renderCalendar();
console.timeEnd('renderCalendar'); // Should be < 50ms

// Measure state operations
console.time('saveState');
saveState();
console.timeEnd('saveState'); // Should be < 10ms

// Check localStorage size
const stateSize = new Blob([JSON.stringify(state)]).size;
console.log('State size:', (stateSize / 1024).toFixed(2), 'KB');
// Warning if > 1MB, limit is ~10MB
```

---

## Deployment

### GitHub Pages Deployment

The application is configured for automatic deployment to GitHub Pages.

#### Initial Setup

1. **Create GitHub repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/Reader79/pwa-app.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages section
   - Source: Deploy from branch
   - Branch: main
   - Folder: / (root)
   - Save

3. **Update paths in code**
   ```javascript
   // sw.js - Update asset paths
   const ASSETS = [
     '/pwa-app/',
     '/pwa-app/index.html',
     // ... other assets
   ];
   
   // manifest.webmanifest - Update scope and start_url
   {
     "start_url": "/pwa-app/",
     "scope": "/pwa-app/"
   }
   ```

4. **Access deployed app**
   - URL: `https://reader79.github.io/pwa-app/`

#### Deployment Workflow

```bash
# 1. Make changes
vim app.js

# 2. Test locally
npm start

# 3. Update Service Worker version
vim sw.js
# Change: const CACHE_VERSION = 'v60'; // Increment

# 4. Commit and push
git add .
git commit -m "feat: Add new feature"
git push origin main

# 5. GitHub Pages rebuilds automatically
# Wait 1-2 minutes for deployment

# 6. Verify deployment
curl -I https://reader79.github.io/pwa-app/

# 7. Test in browser
# Hard refresh (Ctrl+Shift+R) to bypass cache
```

### Version Management

#### Increment Version Numbers

When deploying updates:

1. **Service Worker** (`sw.js`):
   ```javascript
   const CACHE_VERSION = 'v60'; // v59 → v60
   ```

2. **Package.json**:
   ```json
   {
     "version": "0.2.0" // 0.1.0 → 0.2.0
   }
   ```

3. **HTML** (version display):
   ```html
   <title>Смена+ v0.2b</title>
   <div class="version-info">v0.2b</div>
   ```

### Custom Domain Setup (Optional)

1. **Add CNAME file**
   ```bash
   echo "yourapp.example.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```

2. **Configure DNS**
   - Add CNAME record pointing to `reader79.github.io`
   - Wait for DNS propagation

3. **Update manifest and Service Worker**
   ```javascript
   // Update all paths to use new domain
   const ASSETS = [
     'https://yourapp.example.com/',
     'https://yourapp.example.com/index.html',
     // ...
   ];
   ```

---

## Contributing

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow code conventions
   - Add comments where needed
   - Test thoroughly

4. **Commit with meaningful messages**
   ```bash
   git commit -m "feat: Add machine sorting by usage"
   git commit -m "fix: Calendar navigation bug"
   git commit -m "docs: Update API documentation"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Describe your changes
   - Reference any related issues
   - Provide testing instructions

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples**:
```bash
feat(calendar): Add week view
fix(reports): Correct efficiency calculation
docs(api): Document new export format
refactor(state): Simplify state management
perf(render): Optimize calendar rendering
```

### Code Review Checklist

Before submitting PR, verify:

- [ ] Code follows style guide
- [ ] No console.log statements (use proper logging)
- [ ] Functions have JSDoc comments
- [ ] No hardcoded values (use constants)
- [ ] Error handling implemented
- [ ] Tested in multiple browsers
- [ ] No breaking changes (or documented)
- [ ] Service Worker version incremented
- [ ] Documentation updated

### Feature Request Process

1. **Check existing issues** - Avoid duplicates
2. **Open an issue** with template:
   ```markdown
   ## Feature Description
   Brief description of the feature
   
   ## Use Case
   Why is this feature needed?
   
   ## Proposed Solution
   How should it work?
   
   ## Alternatives Considered
   Other approaches you've thought about
   ```

3. **Wait for feedback** - Discuss before implementing
4. **Implement** - If approved, create PR

---

## Troubleshooting

### Development Issues

#### Service Worker Not Updating

**Problem**: Changes don't appear after refresh

**Solution**:
```javascript
// 1. Increment version in sw.js
const CACHE_VERSION = 'v60';

// 2. Hard refresh
// Chrome/Firefox: Ctrl+Shift+R
// Safari: Cmd+Shift+R

// 3. Unregister Service Worker manually
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});

// 4. Clear all caches
caches.keys().then(keys => {
  keys.forEach(key => caches.delete(key));
});
```

#### CORS Issues During Development

**Problem**: Fetch errors when testing locally

**Solution**:
```bash
# Use http-server with CORS enabled
npx http-server . -p 3000 --cors

# Or use browser flags (Chrome)
chrome --disable-web-security --user-data-dir="/tmp/chrome_dev"
```

#### LocalStorage Quota Exceeded

**Problem**: "QuotaExceededError" when saving

**Solution**:
```javascript
// Check current usage
const size = new Blob([JSON.stringify(state)]).size;
console.log('Size:', (size / 1024).toFixed(2), 'KB');

// Compress data before saving
function saveStateCompressed() {
  const compressed = LZString.compress(JSON.stringify(state));
  localStorage.setItem(STORAGE_KEY, compressed);
}

// Or archive old records
function archiveOldRecords() {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - 3); // Keep only 3 months
  
  state.records = state.records.filter(r => 
    new Date(r.date) >= cutoffDate
  );
  saveState();
}
```

### Production Issues

#### App Not Loading After Deployment

**Checklist**:
1. Check browser console for errors
2. Verify asset paths match deployment URL
3. Check Service Worker registration
4. Inspect Network tab for 404s
5. Clear browser cache and try again

#### Reports Not Generating

**Debug**:
```javascript
// Add logging to report functions
function generateReport(monthString, reportType) {
  console.log('Generating report:', monthString, reportType);
  console.log('Records:', state.records);
  
  const monthRecords = state.records.filter(/* ... */);
  console.log('Month records:', monthRecords);
  
  // Continue...
}
```

### Debugging Tools

#### Browser DevTools

```javascript
// Add debugging helpers to console
window.debug = {
  state: () => console.log(state),
  records: () => console.table(state.records),
  machines: () => console.log(state.machines),
  parts: () => console.table(state.parts),
  clear: () => {
    if (confirm('Clear all data?')) {
      localStorage.clear();
      location.reload();
    }
  },
  export: () => exportAppData(),
  resetSW: async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map(r => r.unregister()));
    location.reload();
  }
};

// Usage in console:
// debug.state()
// debug.records()
// debug.clear()
```

#### Performance Profiling

```javascript
// Add performance marks
performance.mark('render-start');
renderCalendar();
performance.mark('render-end');
performance.measure('renderCalendar', 'render-start', 'render-end');

// Get measurements
const measures = performance.getEntriesByType('measure');
console.table(measures);
```

---

## Advanced Topics

### Extending the Application

#### Adding a New Report Type

1. **Add option to select**:
   ```html
   <option value="custom">Custom Report</option>
   ```

2. **Create generator function**:
   ```javascript
   function generateCustomReport(monthRecords, year, month, monthNames) {
     // Your logic here
     return `<div class="machine-card">...</div>`;
   }
   ```

3. **Add to switch statement**:
   ```javascript
   switch (reportType) {
     case 'custom':
       reportHTML = generateCustomReport(monthRecords, year, month, monthNames);
       break;
   }
   ```

#### Adding New Field to Records

1. **Update state structure**:
   ```javascript
   const defaultState = {
     // ... existing fields
     records: [{
       // ... existing fields
       newField: 'default value'
     }]
   };
   ```

2. **Update forms**:
   ```html
   <div class="field">
     <label for="newField">New Field:</label>
     <input type="text" id="newField" name="newField">
   </div>
   ```

3. **Update save function**:
   ```javascript
   const newEntry = {
     // ... existing fields
     newField: recordNewField.value
   };
   ```

4. **Update display**:
   ```javascript
   operationData.innerHTML += `
     <div class="data-row">
       <span class="data-label">New Field:</span>
       <span class="data-value">${entry.newField}</span>
     </div>
   `;
   ```

### Internationalization (i18n)

To add English language support:

1. **Create translations object**:
   ```javascript
   const i18n = {
     ru: {
       title: 'Смена+',
       settings: 'Настройки',
       // ... all strings
     },
     en: {
       title: 'Shift+',
       settings: 'Settings',
       // ... all strings
     }
   };
   ```

2. **Add language selector**:
   ```html
   <select id="languageSelect">
     <option value="ru">Русский</option>
     <option value="en">English</option>
   </select>
   ```

3. **Update all text**:
   ```javascript
   const lang = state.settings.language || 'ru';
   document.querySelector('.app-title').textContent = i18n[lang].title;
   ```

### Backend Integration

To add server synchronization:

1. **Add sync endpoint**:
   ```javascript
   async function syncWithServer() {
     try {
       const response = await fetch('https://api.example.com/sync', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(state)
       });
       
       const serverState = await response.json();
       // Merge or replace state
       state = serverState;
       saveState();
     } catch (error) {
       console.error('Sync failed:', error);
     }
   }
   ```

2. **Add sync button**:
   ```html
   <button onclick="syncWithServer()">🔄 Sync</button>
   ```

3. **Auto-sync on changes**:
   ```javascript
   function saveState() {
     localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
     syncWithServer(); // Add this
   }
   ```

---

## Resources

### Documentation
- [MDN Web Docs](https://developer.mozilla.org/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [PWA Documentation](https://web.dev/progressive-web-apps/)

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - PWA auditing
- [Workbox](https://developers.google.com/web/tools/workbox) - Service Worker library
- [Can I Use](https://caniuse.com/) - Browser compatibility
- [BundlePhobia](https://bundlephobia.com/) - Package size analysis

### Similar Projects
- [Workbox Examples](https://github.com/GoogleChrome/workbox)
- [PWA Examples](https://github.com/hemanth/awesome-pwa)
- [Service Worker Cookbook](https://serviceworke.rs/)

---

## Changelog

### v0.1b (2025-10-18)
- ✨ Initial release
- ✅ Full calendar implementation
- ✅ Record management
- ✅ 6 report types
- ✅ Import/export functionality
- ✅ Offline support
- ✅ Russian localization

### Planned Features (v0.2)
- [ ] Dark/Light theme toggle
- [ ] English language support
- [ ] Advanced filtering in reports
- [ ] Export to Excel
- [ ] Photo attachment for records
- [ ] Multi-user support

---

## License

MIT License - See LICENSE file for details.

---

## Contact

- **GitHub**: [@Reader79](https://github.com/Reader79)
- **Issues**: [GitHub Issues](https://github.com/Reader79/pwa-app/issues)

---

**Last Updated**: October 18, 2025  
**Version**: 0.1b  
**Maintainer**: Reader79
