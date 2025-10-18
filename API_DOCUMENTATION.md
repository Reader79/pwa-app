# PWA Shift Manager - Comprehensive API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Core Data Management](#core-data-management)
3. [UI Components & Dialogs](#ui-components--dialogs)
4. [Calendar & Shift System](#calendar--shift-system)
5. [Reporting & Analytics](#reporting--analytics)
6. [PWA Features](#pwa-features)
7. [Utility Functions](#utility-functions)
8. [Usage Examples](#usage-examples)
9. [Configuration](#configuration)

## Overview

**PWA Shift Manager** is a Progressive Web Application for managing work shifts, calendar scheduling, and productivity reporting. The application is built with vanilla JavaScript, HTML5, and CSS3, featuring offline capabilities through Service Workers.

### Key Features
- Shift scheduling with 16-day cycle system
- Machine and parts management
- Work time tracking and reporting
- Data export/import functionality
- Offline PWA capabilities
- Russian holiday calendar integration

---

## Core Data Management

### State Management

#### `loadState()`
Loads application state from localStorage with fallback to default values.

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

**Returns:** `Object` - Application state object
**Storage Key:** `'pwa-settings-v1'`

#### `saveState()`
Saves current application state to localStorage.

```javascript
function saveState() { 
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); 
}
```

**Side Effects:** Updates localStorage with current state

### Default State Structure

```javascript
const defaultState = {
  main: { 
    operatorName: '', 
    shiftNumber: 1, 
    baseTime: 600 
  },
  machines: [], // Array of machine names
  parts: [], // Array of part objects with operations
  records: [] // Array of work records by date
};
```

### Data Models

#### Part Object
```javascript
{
  id: string,           // Unique identifier
  name: string,         // Part name
  operations: [         // Array of operations
    {
      name: string,     // Operation name
      machineTime: number, // Machine time in minutes
      extraTime: number    // Extra time in minutes
    }
  ]
}
```

#### Record Object
```javascript
{
  id: string,           // Unique record ID
  date: string,         // Date in YYYY-MM-DD format
  shiftType: string,    // 'D' (day), 'N' (night), 'O' (off)
  entries: [            // Array of work entries
    {
      machine: string,      // Machine name
      part: string,         // Part name
      operation: string,    // Operation name
      machineTime: number,  // Machine time in minutes
      extraTime: number,    // Extra time in minutes
      quantity: number,     // Number of parts
      totalTime: number     // Total time (calculated)
    }
  ]
}
```

---

## UI Components & Dialogs

### Dialog Management

#### `openAddRecordDialog(date, isEditMode)`
Opens the dialog for adding or editing work records.

**Parameters:**
- `date` (string, optional): Date in YYYY-MM-DD format
- `isEditMode` (boolean, optional): Whether in edit mode

**Usage:**
```javascript
// Add new record for today
openAddRecordDialog();

// Add record for specific date
openAddRecordDialog('2025-01-15');

// Edit existing record
openAddRecordDialog('2025-01-15', true);
```

#### `openDataEntry()`
Opens the calendar dialog for data entry.

```javascript
function openDataEntry() {
  dataDialog.showModal();
  renderCalendar();
}
```

#### `openReportsDialog()`
Opens the reports generation dialog.

```javascript
function openReportsDialog() {
  const reportsDialog = document.getElementById('reportsDialog');
  const reportMonth = document.getElementById('reportMonth');
  const reportType = document.getElementById('reportType');
  
  if (reportsDialog && reportMonth && reportType) {
    const now = new Date();
    const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    reportMonth.value = currentMonth;
    reportType.value = 'efficiency';
    
    generateReport(currentMonth, 'efficiency');
    reportsDialog.showModal();
  }
}
```

### Tab Management

#### `selectTab(key)`
Switches between different settings tabs.

**Parameters:**
- `key` (string): Tab identifier ('main', 'machines', 'parts', 'export')

**Usage:**
```javascript
selectTab('machines'); // Switch to machines tab
selectTab('parts');    // Switch to parts tab
```

### Form Validation

#### `saveRecordEntry()`
Validates and saves work record entries.

**Validation Rules:**
- Machine selection required
- Part selection required
- Operation selection required
- Machine time required
- Quantity required (minimum 1)

**Returns:** `void`
**Side Effects:** Updates state, saves to localStorage, refreshes UI

---

## Calendar & Shift System

### Shift Type Calculation

#### `getShiftType(date)`
Calculates shift type based on date and shift number using 16-day cycle.

**Parameters:**
- `date` (Date): Date object to calculate shift for

**Returns:** `string` - 'D' (day), 'N' (night), or 'O' (off)

**Algorithm:**
- 16-day cycle: [D,D,O,O,D,D,O,O,N,N,O,O,N,N,O,O]
- Anchor date: October 11, 2025
- Shift offsets: {1: 8, 2: 0, 3: 2, 4: 3}

**Usage:**
```javascript
const today = new Date();
const shiftType = getShiftType(today);
console.log(shiftType); // 'D', 'N', or 'O'
```

#### `getShiftTypeForRecord(date, shiftNumber)`
Alternative shift calculation for specific shift numbers.

**Parameters:**
- `date` (string): Date in YYYY-MM-DD format
- `shiftNumber` (number): Shift number (1-4)

**Returns:** `string` - Shift type

### Calendar Rendering

#### `renderCalendar()`
Renders the monthly calendar with shift indicators and data status.

**Features:**
- Displays current month
- Shows shift types (D/N/O) with color coding
- Indicates data entry status (✓/✗)
- Highlights current day
- Shows Russian holidays
- Interactive date selection

**Usage:**
```javascript
renderCalendar(); // Renders current month
```

### Holiday Management

#### `isHoliday(date)`
Checks if a date is a Russian holiday.

**Parameters:**
- `date` (Date): Date to check

**Returns:** `boolean` - True if holiday

**Supported Years:** 2025+ (with fallback calculation)

**Usage:**
```javascript
const newYear = new Date('2025-01-01');
console.log(isHoliday(newYear)); // true
```

---

## Reporting & Analytics

### Report Generation

#### `generateReport(monthString, reportType)`
Generates various types of monthly reports.

**Parameters:**
- `monthString` (string): Month in YYYY-MM format
- `reportType` (string): Report type identifier

**Report Types:**
- `'efficiency'` - Work efficiency coefficient
- `'parts'` - Produced parts summary
- `'machines'` - Machine utilization
- `'productivity'` - Daily productivity
- `'overtime'` - Overtime and holiday work
- `'quality'` - Work quality analysis

**Usage:**
```javascript
// Generate efficiency report for January 2025
generateReport('2025-01', 'efficiency');

// Generate parts report
generateReport('2025-01', 'parts');
```

### Specific Report Functions

#### `generateEfficiencyReport(monthRecords, year, month, monthNames)`
Generates work efficiency coefficient report.

**Returns:** `string` - HTML report content

**Metrics Calculated:**
- Worked days count
- Total shifts in month
- Total work time
- Expected time (shifts × base time)
- Efficiency coefficient

#### `generatePartsReport(monthRecords, year, month, monthNames)`
Generates produced parts summary report.

**Metrics:**
- Parts produced by type and operation
- Total quantities
- Work time per part type
- Machines used

#### `generateMachinesReport(monthRecords, year, month, monthNames)`
Generates machine utilization report.

**Metrics:**
- Total work time per machine
- Work days per machine
- Parts produced per machine
- Machine variety

### Time Calculations

#### `calculateTotalTime(machineTime, extraTime, quantity)`
Calculates total work time for an operation.

**Parameters:**
- `machineTime` (number): Machine time in minutes
- `extraTime` (number): Extra time in minutes
- `quantity` (number): Number of parts

**Returns:** `number` - Total time in minutes

**Formula:** `(machineTime + extraTime) × quantity`

#### `calculateCoefficient(totalTime, baseTime)`
Calculates work efficiency coefficient.

**Parameters:**
- `totalTime` (number): Total work time
- `baseTime` (number): Base time for comparison

**Returns:** `number` - Efficiency coefficient

**Formula:** `totalTime / baseTime`

---

## PWA Features

### Service Worker Management

#### Service Worker Registration
The app automatically registers a service worker for offline functionality.

```javascript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((registration) => {
        console.log('SW registered successfully');
        registration.update();
      })
      .catch((err) => {
        console.warn('SW registration failed', err);
      });
  });
}
```

### Caching Strategy

#### Cache Versions
- `RUNTIME_CACHE`: Dynamic content caching
- `PRECACHE`: Static assets caching

#### Cached Assets
- HTML files
- CSS stylesheets
- JavaScript files
- Manifest file
- Icons and images

### Offline Functionality

The app works offline with the following capabilities:
- View existing data
- Add new work records
- Generate reports
- Navigate between sections

---

## Utility Functions

### Date Formatting

#### `formatDate(dateInput)`
Formats date for display in Russian locale.

**Parameters:**
- `dateInput` (string|Date): Date to format

**Returns:** `string` - Formatted date (DD.MM.YYYY)

**Usage:**
```javascript
const formatted = formatDate('2025-01-15');
console.log(formatted); // "15.01.2025"
```

#### `formatMonth(date)`
Formats date for month display.

**Parameters:**
- `date` (Date): Date object

**Returns:** `string` - Month and year in Russian

### Data Export/Import

#### `exportAppData()`
Exports all application data to JSON file.

**Returns:** `void`
**Side Effects:** Downloads backup file

**File Format:**
```javascript
{
  version: '1.0',
  timestamp: '2025-01-15T10:30:00.000Z',
  data: {
    main: { /* main settings */ },
    machines: [ /* machine list */ ],
    parts: [ /* parts data */ ],
    records: [ /* work records */ ]
  }
}
```

#### `importAppData(file)`
Imports application data from JSON file.

**Parameters:**
- `file` (File): JSON file to import

**Returns:** `Promise<string>` - Success message

**Usage:**
```javascript
const fileInput = document.getElementById('importFile');
const file = fileInput.files[0];
importAppData(file)
  .then(message => console.log(message))
  .catch(error => console.error(error));
```

### UI Updates

#### `showResults(date)`
Displays work results for a specific date.

**Parameters:**
- `date` (string): Date in YYYY-MM-DD format

**Features:**
- Groups entries by machine
- Shows operation details
- Calculates totals and coefficients
- Provides edit/delete actions

#### `renderCalendar()`
Renders the calendar interface.

**Features:**
- Month navigation
- Shift type indicators
- Data status indicators
- Holiday markers
- Interactive date selection

---

## Usage Examples

### Basic Setup

```javascript
// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // App initialization happens automatically
  console.log('PWA Shift Manager loaded');
});
```

### Adding a Machine

```javascript
// Add a new machine
const machineName = 'CNC Mill #1';
state.machines.push(machineName);
saveState();
renderMachines();
```

### Adding a Part with Operations

```javascript
// Create a new part
const partId = crypto.randomUUID();
const newPart = {
  id: partId,
  name: 'Bracket Assembly',
  operations: [
    {
      name: 'Milling',
      machineTime: 45,
      extraTime: 10
    },
    {
      name: 'Drilling',
      machineTime: 15,
      extraTime: 5
    }
  ]
};

state.parts.push(newPart);
saveState();
renderParts();
```

### Recording Work

```javascript
// Add a work record
const workEntry = {
  machine: 'CNC Mill #1',
  part: 'Bracket Assembly',
  operation: 'Milling',
  machineTime: 45,
  extraTime: 10,
  quantity: 5,
  totalTime: 275 // (45 + 10) * 5
};

const record = {
  id: crypto.randomUUID(),
  date: '2025-01-15',
  shiftType: 'D',
  entries: [workEntry]
};

state.records.push(record);
saveState();
```

### Generating Reports

```javascript
// Generate efficiency report
const report = generateReport('2025-01', 'efficiency');
document.getElementById('reportContent').innerHTML = report;

// Generate parts report
const partsReport = generateReport('2025-01', 'parts');
```

### Data Export/Import

```javascript
// Export data
exportAppData(); // Downloads backup file

// Import data
const fileInput = document.getElementById('importFile');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const result = await importAppData(file);
      console.log(result); // "Данные успешно импортированы"
    } catch (error) {
      console.error('Import failed:', error);
    }
  }
});
```

---

## Configuration

### Environment Variables

The app uses the following configuration:

```javascript
const STORAGE_KEY = 'pwa-settings-v1';
const CACHE_VERSION = 'v59';
const ANCHOR = new Date(Date.UTC(2025, 9, 11)); // October 11, 2025
```

### Shift Cycle Configuration

```javascript
const CYCLE = ['D','D','O','O','D','D','O','O','N','N','O','O','N','N','O','O'];
const SHIFT_OFFSETS = { 1: 8, 2: 0, 3: 2, 4: 3 };
```

### CSS Custom Properties

```css
:root {
  --bg: #0a0a0a;
  --card: #1a1a1a;
  --card-elevated: #2a2a2a;
  --text: #f8fafc;
  --primary: #6366f1;
  --secondary: #8b5cf6;
  --border-radius: 16px;
  --border-radius-sm: 12px;
}
```

### PWA Manifest

```json
{
  "name": "Смена+ v0.1b",
  "short_name": "Смена+",
  "description": "Приложение для управления рабочими сменами",
  "start_url": "/pwa-app/",
  "display": "standalone",
  "theme_color": "#0f172a",
  "background_color": "#0b1220"
}
```

---

## Browser Compatibility

- **Chrome/Edge:** Full support
- **Firefox:** Full support
- **Safari:** Full support (iOS 11.3+)
- **Mobile Browsers:** Full PWA support

## Performance Considerations

- **Offline First:** All core functionality works offline
- **Lazy Loading:** Reports generated on-demand
- **Efficient Caching:** Service worker caches static assets
- **Minimal Dependencies:** No external libraries required

## Security Notes

- Data stored locally in localStorage
- No external API calls
- No sensitive data transmission
- Export/import uses JSON format only

---

*This documentation covers all public APIs, functions, and components of the PWA Shift Manager application. For additional support or feature requests, please refer to the source code or contact the development team.*