# Смена+ PWA - Developer Guide

## Table of Contents
1. [Development Setup](#development-setup)
2. [Architecture Overview](#architecture-overview)
3. [Code Structure](#code-structure)
4. [Development Workflow](#development-workflow)
5. [Testing Strategy](#testing-strategy)
6. [Deployment Guide](#deployment-guide)
7. [Performance Optimization](#performance-optimization)
8. [Security Considerations](#security-considerations)
9. [Browser Compatibility](#browser-compatibility)
10. [Contributing Guidelines](#contributing-guidelines)

## Development Setup

### Prerequisites
- Node.js 16+ (for development server)
- Modern web browser with developer tools
- Code editor with JavaScript/HTML/CSS support
- Git for version control

### Local Development Environment
```bash
# Clone the repository
git clone <repository-url>
cd pwa-shift-manager

# Install development dependencies
npm install

# Start development server
npm run dev
# or
npm start
```

### Development Server
The application uses `http-server` for local development:
```json
{
  "scripts": {
    "start": "npx http-server . -p 3000 -c-1",
    "dev": "npx http-server . -p 3000 -c-1"
  }
}
```

**Server Configuration**:
- Port: 3000
- Cache disabled (`-c-1`) for development
- Serves static files from project root

### Development Tools
Recommended browser extensions:
- **Chrome DevTools**: Built-in PWA debugging
- **Lighthouse**: Performance and PWA auditing
- **Application tab**: Service Worker and storage inspection

## Architecture Overview

### Application Architecture
```
┌─────────────────────────────────────────┐
│                Frontend                 │
│  ┌─────────────┐ ┌─────────────────────┐│
│  │    HTML5    │ │      Vanilla JS     ││
│  │   Semantic  │ │   ES6+ Modules      ││
│  │   Markup    │ │   Event-Driven      ││
│  └─────────────┘ └─────────────────────┘│
│  ┌─────────────────────────────────────┐ │
│  │           CSS3 Grid/Flexbox         │ │
│  │        Custom Properties            │ │
│  │        Responsive Design            │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│              Data Layer                 │
│  ┌─────────────┐ ┌─────────────────────┐│
│  │ LocalStorage│ │    JSON Serialization││
│  │   Browser   │ │    State Management ││
│  │   Storage   │ │    Data Validation  ││
│  └─────────────┘ └─────────────────────┘│
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│               PWA Layer                 │
│  ┌─────────────┐ ┌─────────────────────┐│
│  │Service Worker│ │   Web App Manifest ││
│  │   Caching   │ │   Install Prompts  ││
│  │   Offline   │ │   App-like Behavior││
│  └─────────────┘ └─────────────────────┘│
└─────────────────────────────────────────┘
```

### Design Patterns Used

#### Module Pattern
```javascript
// State management module
const StateManager = {
  STORAGE_KEY: 'pwa-settings-v1',
  
  load() {
    // Load state logic
  },
  
  save(state) {
    // Save state logic
  }
};
```

#### Observer Pattern
```javascript
// Event-driven updates
element.addEventListener('input', () => {
  updateState();
  saveState();
  renderUI();
});
```

#### Factory Pattern
```javascript
// Component creation
function createMachineCard(machine, entries, date) {
  const card = document.createElement('div');
  card.className = 'machine-card';
  // Configure card
  return card;
}
```

## Code Structure

### File Organization
```
├── index.html              # Main HTML document
├── app.js                  # Core application logic
├── styles.css              # Complete styling system
├── sw.js                   # Service Worker
├── manifest.webmanifest    # PWA manifest
├── package.json            # Project configuration
├── README.md               # Project overview
└── assets/
    └── icons/
        └── icon.svg        # Application icon
```

### JavaScript Architecture

#### Core Functions
```javascript
// State Management
function loadState() { /* ... */ }
function saveState() { /* ... */ }

// UI Rendering
function renderCalendar() { /* ... */ }
function renderMachines() { /* ... */ }
function renderParts() { /* ... */ }

// Business Logic
function getShiftType(date) { /* ... */ }
function calculateTotalTime(machineTime, extraTime, quantity) { /* ... */ }
function calculateCoefficient(totalTime, baseTime) { /* ... */ }

// Report Generation
function generateEfficiencyReport() { /* ... */ }
function generatePartsReport() { /* ... */ }
// ... other report functions
```

#### Event Handling
```javascript
// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

// User Interactions
settingsButton.addEventListener('click', openSettings);
addMachine.addEventListener('click', handleAddMachine);
recordDate.addEventListener('change', updateShiftType);
```

#### Data Models
```javascript
// Default state structure
const defaultState = {
  main: { 
    operatorName: '', 
    shiftNumber: 1, 
    baseTime: 600 
  },
  machines: [],
  parts: [],
  records: []
};

// Part model
const partModel = {
  id: 'uuid',
  name: 'string',
  operations: [
    {
      name: 'string',
      machineTime: 'number',
      extraTime: 'number'
    }
  ]
};
```

### CSS Architecture

#### CSS Custom Properties
```css
:root {
  /* Color System */
  --bg: #0a0a0a;
  --card: #1a1a1a;
  --text: #f8fafc;
  --primary: #6366f1;
  
  /* Layout */
  --border-radius: 16px;
  --shadow-soft: 0 4px 20px rgba(0,0,0,0.3);
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
}
```

#### Component-Based Styling
```css
/* Component: Button */
.button-primary {
  /* Base button styles */
}

/* Component: Dialog */
.settings-dialog {
  /* Dialog container styles */
}

.settings-dialog::backdrop {
  /* Backdrop styles */
}

/* Component: Calendar */
.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.calendar .cell {
  /* Cell base styles */
}

.cell.day { /* Day shift styles */ }
.cell.night { /* Night shift styles */ }
.cell.off { /* Day off styles */ }
```

#### Responsive Design
```css
/* Mobile First */
.button-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

/* Tablet */
@media (min-width: 640px) {
  .button-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 960px) {
  .button-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## Development Workflow

### Code Style Guidelines

#### JavaScript Style
```javascript
// Use const/let, avoid var
const state = loadState();
let currentRecord = null;

// Function naming: camelCase
function calculateTotalTime() {}
function renderMachinesList() {}

// Event handlers: handle prefix
function handleAddMachine() {}
function handleDeleteEntry() {}

// Boolean functions: is/has prefix
function isHoliday(date) {}
function hasData(date) {}

// Constants: UPPER_CASE
const STORAGE_KEY = 'pwa-settings-v1';
const CYCLE = ['D','D','O','O',...];
```

#### HTML Structure
```html
<!-- Semantic HTML5 -->
<main class="app-main">
  <section class="button-grid">
    <button class="primary" id="actionOne">
      <svg class="button-icon" aria-hidden="true">...</svg>
      Action Text
    </button>
  </section>
</main>

<!-- Accessibility attributes -->
<dialog id="settingsDialog" aria-labelledby="settingsTitle">
  <h2 id="settingsTitle">Settings</h2>
  <nav class="tabs" role="tablist">
    <button role="tab" aria-selected="true">Tab</button>
  </nav>
</dialog>
```

#### CSS Organization
```css
/* 1. Custom Properties */
:root { /* ... */ }

/* 2. Reset/Base */
* { box-sizing: border-box; }
body { /* ... */ }

/* 3. Layout Components */
.app-header { /* ... */ }
.app-main { /* ... */ }

/* 4. UI Components */
.button-primary { /* ... */ }
.settings-dialog { /* ... */ }

/* 5. Utilities */
.hidden { display: none; }

/* 6. Media Queries */
@media (max-width: 768px) { /* ... */ }
```

### Version Control

#### Git Workflow
```bash
# Feature development
git checkout -b feature/new-report-type
git add .
git commit -m "Add productivity report type"
git push origin feature/new-report-type

# Bug fixes
git checkout -b fix/calendar-navigation
git add .
git commit -m "Fix calendar month navigation issue"
git push origin fix/calendar-navigation
```

#### Commit Message Format
```
type(scope): description

feat(reports): add overtime analysis report
fix(calendar): resolve shift calculation for leap years
docs(api): update function documentation
style(css): improve mobile responsiveness
refactor(state): simplify data persistence logic
```

### Development Tasks

#### Adding New Features
1. **Plan**: Define requirements and user stories
2. **Design**: Create UI mockups and API design
3. **Implement**: Write code following style guidelines
4. **Test**: Manual testing and edge case validation
5. **Document**: Update API docs and user guide
6. **Deploy**: Update version and deploy

#### Bug Fix Process
1. **Reproduce**: Confirm bug and create test case
2. **Debug**: Use browser dev tools to identify root cause
3. **Fix**: Implement minimal fix with error handling
4. **Test**: Verify fix and check for regressions
5. **Document**: Update relevant documentation

## Testing Strategy

### Manual Testing Checklist

#### Core Functionality
- [ ] Settings save and load correctly
- [ ] Machine CRUD operations work
- [ ] Parts and operations management functions
- [ ] Data entry form validation
- [ ] Calendar navigation and display
- [ ] Report generation for all types
- [ ] Export/import functionality

#### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

#### PWA Features
- [ ] Service Worker registration
- [ ] Offline functionality
- [ ] Install prompt
- [ ] App icon display
- [ ] Manifest validation

### Automated Testing Setup

#### Unit Tests (Example)
```javascript
// test-utils.js
function testCalculateTotalTime() {
  const result = calculateTotalTime(10, 5, 3);
  console.assert(result === 45, 'Total time calculation failed');
}

function testShiftCalculation() {
  const result = getShiftType(new Date('2025-10-18'));
  console.assert(['D', 'N', 'O'].includes(result), 'Invalid shift type');
}

// Run tests
testCalculateTotalTime();
testShiftCalculation();
```

#### Integration Tests
```javascript
// Test data persistence
function testDataPersistence() {
  const testState = { machines: ['Test Machine'] };
  localStorage.setItem('test-key', JSON.stringify(testState));
  const loaded = JSON.parse(localStorage.getItem('test-key'));
  console.assert(loaded.machines[0] === 'Test Machine', 'Data persistence failed');
  localStorage.removeItem('test-key');
}
```

### Performance Testing

#### Lighthouse Audit
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html

# Check PWA score
lighthouse http://localhost:3000 --only-categories=pwa
```

#### Performance Metrics
- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## Deployment Guide

### Production Build

#### Pre-deployment Checklist
- [ ] Update version number in manifest.webmanifest
- [ ] Update cache version in sw.js
- [ ] Test all functionality
- [ ] Run Lighthouse audit
- [ ] Validate HTML/CSS
- [ ] Check console for errors

#### Build Process
```bash
# No build step required for vanilla JS
# Simply deploy files to web server

# Optional: Minify assets
npx html-minifier --input-dir . --output-dir dist --file-ext html
npx clean-css-cli -o dist/styles.css styles.css
npx terser app.js -o dist/app.js
```

### Server Configuration

#### Apache (.htaccess)
```apache
# Enable HTTPS redirect
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Cache static assets
<FilesMatch "\.(css|js|svg|png|jpg|jpeg|gif|ico|woff|woff2)$">
  ExpiresActive On
  ExpiresDefault "access plus 1 month"
</FilesMatch>

# Cache manifest
<FilesMatch "\.webmanifest$">
  ExpiresActive On
  ExpiresDefault "access plus 1 week"
</FilesMatch>

# Service Worker - no cache
<FilesMatch "sw\.js$">
  ExpiresActive On
  ExpiresDefault "access plus 0 seconds"
</FilesMatch>
```

#### Nginx
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Serve files
    location / {
        root /path/to/app;
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(css|js|svg|png|jpg|jpeg|gif|ico|woff|woff2)$ {
        expires 1M;
        add_header Cache-Control "public, immutable";
    }
    
    # Service Worker - no cache
    location = /sw.js {
        expires 0;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

### Deployment Environments

#### Development
- Local http-server
- No caching
- Debug mode enabled
- Source maps available

#### Staging
- HTTPS required
- Production-like caching
- Testing with real data
- Performance monitoring

#### Production
- HTTPS enforced
- Optimized caching
- Error monitoring
- Analytics tracking

## Performance Optimization

### JavaScript Optimization

#### Code Splitting
```javascript
// Lazy load report generators
async function loadReportModule() {
  const { generateAdvancedReport } = await import('./reports-advanced.js');
  return generateAdvancedReport;
}

// Use when needed
document.getElementById('advancedReport').addEventListener('click', async () => {
  const generator = await loadReportModule();
  generator(data);
});
```

#### Memory Management
```javascript
// Clean up event listeners
function cleanup() {
  element.removeEventListener('click', handler);
  observer.disconnect();
}

// Avoid memory leaks in closures
function createHandler(data) {
  return function handler(event) {
    // Use data
    // Don't capture unnecessary variables
  };
}
```

### CSS Optimization

#### Critical CSS
```html
<!-- Inline critical CSS -->
<style>
  /* Above-the-fold styles */
  .app-header { /* ... */ }
  .button-grid { /* ... */ }
</style>

<!-- Load full stylesheet -->
<link rel="stylesheet" href="styles.css" media="print" onload="this.media='all'">
```

#### CSS Performance
```css
/* Use efficient selectors */
.button-primary { /* Good */ }
div.container > ul li a { /* Avoid */ }

/* Minimize repaints */
.element {
  transform: translateX(100px); /* Good */
  left: 100px; /* Causes reflow */
}

/* Use containment */
.calendar {
  contain: layout style paint;
}
```

### Service Worker Optimization

#### Efficient Caching
```javascript
// Cache strategy optimization
const CACHE_STRATEGIES = {
  'text/html': 'networkFirst',
  'text/css': 'cacheFirst',
  'application/javascript': 'cacheFirst',
  'image/': 'cacheFirst'
};

// Selective precaching
const CRITICAL_ASSETS = [
  '/',
  '/styles.css',
  '/app.js'
];
```

## Security Considerations

### Data Protection

#### Input Validation
```javascript
// Sanitize user input
function sanitizeInput(input) {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .substring(0, 100); // Limit length
}

// Validate data types
function validateRecord(record) {
  if (typeof record.machineTime !== 'number') {
    throw new Error('Invalid machine time');
  }
  if (record.quantity < 0) {
    throw new Error('Invalid quantity');
  }
}
```

#### Data Storage Security
```javascript
// Encrypt sensitive data (if needed)
function encryptData(data) {
  // Use Web Crypto API for encryption
  return crypto.subtle.encrypt(algorithm, key, data);
}

// Validate data integrity
function validateDataIntegrity(data) {
  const checksum = calculateChecksum(data);
  return checksum === data.checksum;
}
```

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               style-src 'self' 'unsafe-inline' fonts.googleapis.com;
               font-src 'self' fonts.gstatic.com;
               script-src 'self';
               img-src 'self' data:;">
```

### HTTPS Requirements
- PWA features require HTTPS in production
- Service Worker requires secure context
- Geolocation and other APIs need HTTPS

## Browser Compatibility

### Feature Support Matrix

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Service Worker | ✅ 40+ | ✅ 44+ | ✅ 11.1+ | ✅ 17+ |
| Web App Manifest | ✅ 39+ | ✅ 82+ | ✅ 13+ | ✅ 79+ |
| CSS Grid | ✅ 57+ | ✅ 52+ | ✅ 10.1+ | ✅ 16+ |
| CSS Custom Properties | ✅ 49+ | ✅ 31+ | ✅ 9.1+ | ✅ 15+ |
| LocalStorage | ✅ 4+ | ✅ 3.5+ | ✅ 4+ | ✅ 8+ |

### Polyfills and Fallbacks

#### Service Worker Fallback
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
} else {
  console.warn('Service Worker not supported');
  // Implement fallback caching strategy
}
```

#### CSS Grid Fallback
```css
.button-grid {
  display: flex; /* Fallback */
  flex-wrap: wrap;
  gap: 20px;
}

@supports (display: grid) {
  .button-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
```

## Contributing Guidelines

### Code Review Process
1. **Self Review**: Check code quality and functionality
2. **Automated Checks**: Run tests and linting
3. **Peer Review**: Get feedback from team members
4. **Testing**: Verify changes work as expected
5. **Documentation**: Update relevant docs

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Manual testing completed
- [ ] Browser compatibility verified
- [ ] PWA features tested

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

### Issue Reporting
```markdown
## Bug Report
**Describe the bug**
Clear description of the issue

**To Reproduce**
Steps to reproduce the behavior

**Expected behavior**
What should happen

**Screenshots**
If applicable, add screenshots

**Environment**
- Browser: [e.g. Chrome 96]
- Device: [e.g. iPhone 12]
- OS: [e.g. iOS 15]
```

This developer guide provides comprehensive information for developers working on the Смена+ PWA, covering all aspects from setup to deployment and maintenance.