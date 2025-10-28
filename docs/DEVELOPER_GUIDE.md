# PWA Shift Manager - Developer Guide

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Data Flow](#data-flow)
4. [State Management](#state-management)
5. [Service Worker Implementation](#service-worker-implementation)
6. [Adding New Features](#adding-new-features)
7. [Testing Guide](#testing-guide)
8. [Performance Optimization](#performance-optimization)
9. [Deployment](#deployment)
10. [Contributing Guidelines](#contributing-guidelines)

## Architecture Overview

### Technology Stack

- **Frontend:** Vanilla JavaScript (ES6+)
- **Styling:** CSS3 with CSS Variables
- **Storage:** localStorage for data persistence
- **Offline:** Service Worker with Cache API
- **Build:** No build process (vanilla implementation)

### Design Principles

1. **Progressive Enhancement:** Core functionality works without JS
2. **Offline First:** All features work offline
3. **Mobile First:** Responsive design starting from mobile
4. **Performance:** Minimal dependencies, optimized assets
5. **Accessibility:** ARIA labels, semantic HTML

### Application Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Browser   │────▶│  Service     │────▶│   Cache     │
│             │     │  Worker      │     │   Storage   │
└─────────────┘     └──────────────┘     └─────────────┘
       │                                         │
       ▼                                         ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  App Shell  │────▶│ localStorage │────▶│  App State  │
│  (HTML/CSS) │     │              │     │             │
└─────────────┘     └──────────────┘     └─────────────┘
```

## Project Structure

```
/workspace/
├── index.html              # Main HTML file
├── app.js                  # Main application logic
├── sw.js                   # Service Worker
├── styles.css              # Application styles
├── manifest.webmanifest    # PWA manifest
├── package.json            # Project metadata
├── README.md               # Project readme
├── assets/                 # Static assets
│   └── icons/             
│       └── icon.svg       # Application icon
└── docs/                   # Documentation
    ├── API_DOCUMENTATION.md
    ├── USAGE_GUIDE.md
    ├── COMPONENT_DOCUMENTATION.md
    └── DEVELOPER_GUIDE.md
```

## Data Flow

### State Structure

```javascript
const state = {
  main: {
    operatorName: string,  // Operator's name
    shiftNumber: number,   // 1-4
    baseTime: number      // Base time in minutes
  },
  machines: string[],      // Machine names
  parts: [{
    id: string,           // UUID
    name: string,         // Part name
    operations: [{
      name: string,       // Operation name
      machineTime: number,// Machine time
      extraTime: number   // Extra time
    }]
  }],
  records: [{
    id: string,           // UUID
    date: string,         // YYYY-MM-DD
    shiftType: string,    // 'D', 'N', 'O'
    entries: [{
      machine: string,
      part: string,
      operation: string,
      machineTime: number,
      extraTime: number,
      quantity: number,
      totalTime: number
    }]
  }]
};
```

### Data Flow Diagram

```
User Input ──▶ Event Handler ──▶ State Update ──▶ localStorage
    │                                   │
    ▼                                   ▼
UI Update ◀── Render Function ◀── State Change
```

## State Management

### Loading State

```javascript
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const s = JSON.parse(raw);
    return { ...structuredClone(defaultState), ...s };
  } catch {
    return structuredClone(defaultState);
  }
}
```

### Saving State

```javascript
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
```

### State Updates

```javascript
// Direct mutation followed by save
state.machines.push("New Machine");
saveState();
renderMachines();

// Complex updates
function updatePart(partId, updates) {
  const partIndex = state.parts.findIndex(p => p.id === partId);
  if (partIndex !== -1) {
    state.parts[partIndex] = {
      ...state.parts[partIndex],
      ...updates
    };
    saveState();
    renderParts();
  }
}
```

## Service Worker Implementation

### Registration

```javascript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((registration) => {
        console.log('SW registered successfully');
        registration.update(); // Force update check
      })
      .catch((err) => {
        console.warn('SW registration failed', err);
      });
  });
}
```

### Cache Strategy

```javascript
// sw.js
const CACHE_VERSION = 'v59';
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;
const PRECACHE = `precache-${CACHE_VERSION}`;

// Pre-cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Cache strategies
self.addEventListener('fetch', (event) => {
  if (isHtmlRequest(request)) {
    // Network first, fallback to cache
    event.respondWith(networkFirst(request));
  } else {
    // Cache first, fallback to network
    event.respondWith(cacheFirst(request));
  }
});
```

### Update Mechanism

```javascript
// Force reload on update
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Clean old caches
    const keys = await caches.keys();
    await Promise.all(keys.map(key => {
      if (![PRECACHE, RUNTIME_CACHE].includes(key)) {
        return caches.delete(key);
      }
    }));
    
    // Notify clients
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({ type: 'SW_UPDATED' });
    });
  })());
});
```

## Adding New Features

### Adding a New Entity Type

Example: Adding "Tools" management

1. **Update State Structure:**
```javascript
const defaultState = {
  // ... existing state
  tools: [] // New array for tools
};
```

2. **Create UI Components:**
```html
<!-- In settings dialog -->
<button class="tab" role="tab" data-tab="tools">Инструменты</button>

<div class="tab-panel hidden" data-panel="tools">
  <div class="row">
    <input id="newTool" type="text" placeholder="Название инструмента">
    <button class="primary" id="addTool">Добавить</button>
  </div>
  <ul id="toolsList" class="list"></ul>
</div>
```

3. **Add Render Function:**
```javascript
function renderTools() {
  const toolsList = document.getElementById('toolsList');
  toolsList.innerHTML = '';
  
  state.tools.forEach((tool, idx) => {
    const li = document.createElement('li');
    // ... create tool UI
    toolsList.appendChild(li);
  });
}
```

4. **Add Event Handlers:**
```javascript
document.getElementById('addTool').addEventListener('click', () => {
  const name = document.getElementById('newTool').value.trim();
  if (name) {
    state.tools.push({
      id: crypto.randomUUID(),
      name: name,
      // ... other properties
    });
    saveState();
    renderTools();
  }
});
```

### Adding a New Report Type

Example: Tool usage report

1. **Add Report Option:**
```html
<option value="tools">Использование инструментов</option>
```

2. **Create Report Generator:**
```javascript
function generateToolsReport(monthRecords, year, month, monthNames) {
  // Analyze tool usage from records
  const toolStats = {};
  
  monthRecords.forEach(record => {
    record.entries.forEach(entry => {
      // Process tool data
    });
  });
  
  // Generate HTML
  return `
    <div class="machine-card">
      <div class="machine-header">
        ИСПОЛЬЗОВАНИЕ ИНСТРУМЕНТОВ - ${monthNames[month - 1]} ${year}
      </div>
      <div class="operations-container">
        <!-- Tool statistics -->
      </div>
    </div>
  `;
}
```

3. **Update Report Switch:**
```javascript
switch (reportType) {
  // ... existing cases
  case 'tools':
    reportHTML = generateToolsReport(monthRecords, year, month, monthNames);
    break;
}
```

### Adding New Calculations

Example: Cost calculation

```javascript
// Add cost properties to operations
operation.costPerMinute = 50; // Rubles per minute

// Calculate costs
function calculateOperationCost(entry) {
  const totalMinutes = entry.totalTime;
  const costPerMinute = getOperationCost(entry.part, entry.operation);
  return totalMinutes * costPerMinute;
}

// Add to reports
function generateCostReport(records) {
  let totalCost = 0;
  records.forEach(record => {
    record.entries.forEach(entry => {
      totalCost += calculateOperationCost(entry);
    });
  });
  return totalCost;
}
```

## Testing Guide

### Manual Testing Checklist

1. **Installation:**
   - [ ] App installs as PWA
   - [ ] Icons display correctly
   - [ ] Manifest loads properly

2. **Offline Functionality:**
   - [ ] Disable network
   - [ ] All features work
   - [ ] Data persists
   - [ ] Reports generate

3. **Data Management:**
   - [ ] Add/edit/delete machines
   - [ ] Add/edit/delete parts
   - [ ] Add/edit/delete operations
   - [ ] Add/edit/delete records

4. **Calendar:**
   - [ ] Correct shift calculation
   - [ ] Holiday marking
   - [ ] Navigation works
   - [ ] Status indicators

5. **Reports:**
   - [ ] All report types generate
   - [ ] Calculations are correct
   - [ ] Export/import works

### Automated Testing

```javascript
// Example test utilities
function testShiftCalculation() {
  const testCases = [
    { date: '2025-10-11', shift: 1, expected: 'N' },
    { date: '2025-10-11', shift: 2, expected: 'D' },
    { date: '2025-10-11', shift: 3, expected: 'O' },
    { date: '2025-10-11', shift: 4, expected: 'O' }
  ];
  
  testCases.forEach(test => {
    state.main.shiftNumber = test.shift;
    const result = getShiftType(new Date(test.date));
    console.assert(result === test.expected, 
      `Failed: ${test.date} shift ${test.shift} expected ${test.expected} got ${result}`);
  });
}

// Run tests
function runTests() {
  console.log('Running tests...');
  testShiftCalculation();
  testCoefficientCalculation();
  testDataExportImport();
  console.log('Tests completed');
}
```

### Debug Utilities

```javascript
// Debug helper functions
window.debug = {
  // View current state
  getState: () => state,
  
  // Clear all data
  clearAll: () => {
    if (confirm('Clear all data?')) {
      localStorage.clear();
      location.reload();
    }
  },
  
  // Generate test data
  generateTestData: () => {
    // Add test machines
    state.machines = ['Machine 1', 'Machine 2', 'Machine 3'];
    
    // Add test parts
    state.parts = [{
      id: '1',
      name: 'Test Part',
      operations: [
        { name: 'Op 1', machineTime: 10, extraTime: 5 }
      ]
    }];
    
    // Add test records
    const today = new Date().toISOString().split('T')[0];
    state.records.push({
      id: '1',
      date: today,
      shiftType: 'D',
      entries: [{
        machine: 'Machine 1',
        part: 'Test Part',
        operation: 'Op 1',
        machineTime: 10,
        extraTime: 5,
        quantity: 5,
        totalTime: 75
      }]
    });
    
    saveState();
    location.reload();
  }
};
```

## Performance Optimization

### Loading Performance

1. **Critical CSS:**
```css
/* Inline critical CSS in HTML */
<style>
  /* Reset and basic layout */
  * { box-sizing: border-box; }
  body { margin: 0; background: #0a0a0a; }
  /* ... other critical styles */
</style>
```

2. **Lazy Loading:**
```javascript
// Lazy load non-critical features
function loadReportsModule() {
  if (!window.reportsLoaded) {
    // Load report generation code
    import('./reports.js').then(module => {
      window.reportsLoaded = true;
    });
  }
}
```

3. **Resource Hints:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://fonts.gstatic.com">
```

### Runtime Performance

1. **Debouncing:**
```javascript
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Usage
const debouncedSave = debounce(saveState, 500);
```

2. **Virtual Scrolling:**
```javascript
// For large lists
class VirtualList {
  constructor(container, items, itemHeight) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.visibleItems = Math.ceil(container.clientHeight / itemHeight);
  }
  
  render(scrollTop) {
    const startIndex = Math.floor(scrollTop / this.itemHeight);
    const endIndex = startIndex + this.visibleItems;
    
    // Render only visible items
    const visibleItems = this.items.slice(startIndex, endIndex);
    // ... render logic
  }
}
```

3. **Memoization:**
```javascript
const memoize = (fn) => {
  const cache = {};
  return (...args) => {
    const key = JSON.stringify(args);
    if (key in cache) {
      return cache[key];
    }
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
};

// Usage
const memoizedCalculation = memoize(expensiveCalculation);
```

## Deployment

### GitHub Pages

1. **Update paths in sw.js:**
```javascript
const ASSETS = [
  '/pwa-app/',  // Update to match your repo name
  '/pwa-app/index.html',
  // ... other assets
];
```

2. **Deploy command:**
```bash
# If using gh-pages branch
git subtree push --prefix=dist origin gh-pages

# Or use GitHub Actions
# See .github/workflows/deploy.yml
```

### Custom Domain

1. **Update manifest:**
```json
{
  "start_url": "/",
  "scope": "/"
}
```

2. **Update service worker scope:**
```javascript
navigator.serviceWorker.register('./sw.js', {
  scope: '/'
});
```

### Environment Configuration

```javascript
// config.js
const CONFIG = {
  development: {
    API_URL: 'http://localhost:3000',
    DEBUG: true
  },
  production: {
    API_URL: 'https://api.example.com',
    DEBUG: false
  }
};

const ENV = window.location.hostname === 'localhost' ? 'development' : 'production';
const config = CONFIG[ENV];
```

## Contributing Guidelines

### Code Style

1. **JavaScript:**
   - Use ES6+ features
   - Consistent naming (camelCase for variables, PascalCase for classes)
   - Add JSDoc comments for functions
   - No semicolons (optional, but be consistent)

2. **CSS:**
   - Use CSS variables for theming
   - Mobile-first media queries
   - BEM-like naming for components
   - Logical property groups

3. **HTML:**
   - Semantic elements
   - ARIA labels for accessibility
   - Valid HTML5

### Git Workflow

1. **Branch naming:**
   - `feature/description`
   - `fix/issue-description`
   - `docs/what-documented`

2. **Commit messages:**
   ```
   type(scope): description
   
   - feat: new feature
   - fix: bug fix
   - docs: documentation
   - style: formatting
   - refactor: code restructuring
   - test: adding tests
   - chore: maintenance
   ```

3. **Pull Request template:**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation
   
   ## Testing
   - [ ] Tested on mobile
   - [ ] Tested offline
   - [ ] Tested in multiple browsers
   
   ## Screenshots
   If applicable
   ```

### Adding Documentation

1. **Code comments:**
```javascript
/**
 * Calculates the efficiency coefficient
 * @param {number} totalTime - Total work time in minutes
 * @param {number} baseTime - Base time in minutes
 * @returns {number} Efficiency coefficient (0-2+)
 */
function calculateCoefficient(totalTime, baseTime) {
  // ... implementation
}
```

2. **README updates:**
   - Keep feature list current
   - Update screenshots
   - Document breaking changes

3. **API documentation:**
   - Document all public functions
   - Include examples
   - Note parameter types

### Performance Budget

- Initial load: < 3s on 3G
- Time to interactive: < 5s
- Bundle size: < 500KB
- Lighthouse score: > 90

### Browser Support

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile browsers: iOS Safari 14+, Chrome Android

### Security Considerations

1. **Input validation:**
```javascript
function sanitizeInput(input) {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML
    .slice(0, 100); // Limit length
}
```

2. **Content Security Policy:**
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; style-src 'self' 'unsafe-inline';">
```

3. **HTTPS only:**
   - Service Workers require HTTPS
   - Use HSTS header
   - No mixed content