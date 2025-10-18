# Смена+ PWA - Comprehensive API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Core APIs](#core-apis)
4. [Data Models](#data-models)
5. [UI Components](#ui-components)
6. [Service Worker](#service-worker)
7. [Storage System](#storage-system)
8. [Calendar System](#calendar-system)
9. [Reporting System](#reporting-system)
10. [Usage Examples](#usage-examples)

## Overview

**Смена+** is a Progressive Web Application for managing work shifts, production tracking, and generating reports. It's built with vanilla JavaScript, HTML5, and CSS3, featuring offline capabilities through Service Worker implementation.

### Key Features
- Shift schedule management with 16-day cycle
- Production data entry and tracking
- Machine and parts management
- Comprehensive reporting system
- Data export/import functionality
- Offline-first architecture

### Technology Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Storage**: LocalStorage with JSON serialization
- **PWA**: Service Worker for caching and offline support
- **UI**: Custom CSS with CSS Grid and Flexbox
- **Icons**: SVG icons with custom styling

## Architecture

The application follows a modular architecture with clear separation of concerns:

```
├── index.html          # Main HTML structure
├── app.js              # Core application logic
├── styles.css          # Complete styling system
├── sw.js               # Service Worker for PWA functionality
├── manifest.webmanifest # PWA manifest
└── assets/
    └── icons/
        └── icon.svg    # Application icon
```

## Core APIs

### State Management API

#### `loadState()`
Loads application state from localStorage with fallback to default state.

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

**Returns**: Complete application state object
**Error Handling**: Returns default state on parsing errors

#### `saveState()`
Persists current application state to localStorage.

```javascript
function saveState() { 
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); 
}
```

**Side Effects**: Updates localStorage immediately
**Usage**: Call after any state modification

### Shift Calculation API

#### `getShiftType(date)`
Calculates shift type for a given date based on 16-day cycle.

```javascript
function getShiftType(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const days = Math.floor((d - ANCHOR) / (24*3600*1000));
  const baseIndex = ((days % CYCLE.length) + CYCLE.length) % CYCLE.length;
  const shiftIdx = (baseIndex + (SHIFT_OFFSETS[state.main.shiftNumber]||0)) % CYCLE.length;
  return CYCLE[shiftIdx];
}
```

**Parameters**:
- `date` (Date): Target date for shift calculation

**Returns**: 
- `'D'` - Day shift
- `'N'` - Night shift  
- `'O'` - Day off

**Example**:
```javascript
const shiftType = getShiftType(new Date('2025-10-18'));
console.log(shiftType); // 'D', 'N', or 'O'
```

#### `getShiftTypeForRecord(date, shiftNumber)`
Legacy function for shift type calculation with explicit shift number.

```javascript
function getShiftTypeForRecord(date, shiftNumber) {
  const anchorDate = new Date('2025-10-11');
  const targetDate = new Date(date);
  const daysDiff = Math.floor((targetDate - anchorDate) / (1000 * 60 * 60 * 24));
  const cyclePosition = ((daysDiff % 16) + 16) % 16;
  
  const cycle = ['D','D','O','O','D','D','O','O','N','N','O','O','N','N','O','O'];
  const shiftOffset = (shiftNumber - 1) * 4;
  const actualPosition = (cyclePosition + shiftOffset) % 16;
  
  return cycle[actualPosition];
}
```

### Time Calculation API

#### `calculateTotalTime(machineTime, extraTime, quantity)`
Calculates total production time for an operation.

```javascript
function calculateTotalTime(machineTime, extraTime, quantity) {
  return (machineTime + extraTime) * quantity;
}
```

**Parameters**:
- `machineTime` (number): Machine operation time in minutes
- `extraTime` (number): Additional setup/cleanup time in minutes  
- `quantity` (number): Number of parts produced

**Returns**: Total time in minutes

**Example**:
```javascript
const totalTime = calculateTotalTime(5.5, 2.0, 10);
console.log(totalTime); // 75 minutes
```

#### `calculateCoefficient(totalTime, baseTime)`
Calculates efficiency coefficient based on total time vs base time.

```javascript
function calculateCoefficient(totalTime, baseTime) {
  if (!baseTime || baseTime === 0) {
    return 0;
  }
  return Math.round((totalTime / baseTime) * 100) / 100;
}
```

**Parameters**:
- `totalTime` (number): Actual work time in minutes
- `baseTime` (number): Expected base time in minutes

**Returns**: Efficiency coefficient (rounded to 2 decimal places)

**Example**:
```javascript
const coefficient = calculateCoefficient(480, 600);
console.log(coefficient); // 0.8 (80% efficiency)
```

### Data Management API

#### `exportAppData()`
Exports complete application data as JSON file download.

```javascript
function exportAppData() {
  try {
    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      data: {
        main: state.main,
        machines: state.machines,
        parts: state.parts,
        records: state.records
      }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pwa-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export error:', error);
  }
}
```

**Side Effects**: Downloads JSON file to user's device
**Error Handling**: Logs errors to console

#### `importAppData(file)`
Imports application data from JSON file.

```javascript
function importAppData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        
        if (!importData.data || !importData.version) {
          throw new Error('Invalid file format');
        }
        
        // Import data
        state.main = importData.data.main || defaultState.main;
        state.machines = importData.data.machines || defaultState.machines;
        state.parts = importData.data.parts || defaultState.parts;
        state.records = importData.data.records || defaultState.records;
        
        localStorage.setItem('pwa-state', JSON.stringify(state));
        
        // Update UI
        hydrateMain();
        renderMachines();
        renderParts();
        
        resolve('Data imported successfully');
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('File reading error'));
    reader.readAsText(file);
  });
}
```

**Parameters**:
- `file` (File): JSON file containing backup data

**Returns**: Promise resolving to success message
**Error Handling**: Rejects promise with error details

### Holiday System API

#### `isHoliday(date)`
Checks if a given date is a Russian federal holiday.

```javascript
function isHoliday(date) {
  const year = date.getFullYear();
  let set = HOLIDAYS_BY_YEAR.get(year);
  if (!set) {
    set = computeDefaultHolidays(year);
    HOLIDAYS_BY_YEAR.set(year, set);
  }
  return set.has(fmtDateISO(date));
}
```

**Parameters**:
- `date` (Date): Date to check

**Returns**: Boolean indicating holiday status

**Example**:
```javascript
const isNewYear = isHoliday(new Date('2025-01-01'));
console.log(isNewYear); // true
```

## Data Models

### Application State Structure

```javascript
const defaultState = {
  main: { 
    operatorName: '',    // Operator's name
    shiftNumber: 1,      // Shift number (1-4)
    baseTime: 600        // Base time in minutes
  },
  machines: [],          // Array of machine names
  parts: [],            // Array of part objects
  records: []           // Array of work records
};
```

### Part Object Structure

```javascript
{
  id: "uuid-string",           // Unique identifier
  name: "Part Name",           // Display name
  operations: [                // Array of operations
    {
      name: "Operation Name",   // Operation description
      machineTime: 5.5,        // Machine time in minutes
      extraTime: 2.0           // Extra time in minutes
    }
  ]
}
```

### Record Object Structure

```javascript
{
  id: "uuid-string",           // Unique identifier
  date: "2025-10-18",         // Date in YYYY-MM-DD format
  shiftType: "D",             // 'D', 'N', or 'O'
  entries: [                  // Array of work entries
    {
      machine: "Machine Name", // Machine used
      part: "Part Name",       // Part produced
      operation: "Op Name",    // Operation performed
      machineTime: 5.5,        // Machine time
      extraTime: 2.0,          // Extra time
      quantity: 10,            // Parts produced
      totalTime: 75            // Calculated total time
    }
  ]
}
```

## UI Components

### Dialog Management

#### Settings Dialog
- **ID**: `settingsDialog`
- **Purpose**: Main configuration interface
- **Tabs**: Main, Machines, Parts, Export/Import

#### Data Entry Dialog  
- **ID**: `addRecordDialog`
- **Purpose**: Production data entry
- **Features**: Auto-calculation, validation

#### Reports Dialog
- **ID**: `reportsDialog` 
- **Purpose**: Report generation and display
- **Types**: Efficiency, Parts, Machines, Productivity, Overtime, Quality

### Calendar Component

#### Structure
```html
<div class="calendar" id="calendar">
  <!-- 7 header cells for weekdays -->
  <!-- Variable date cells based on month -->
</div>
```

#### Features
- Visual shift indicators (D/N/O)
- Holiday markers
- Data status indicators
- Click navigation

#### Styling Classes
- `.cell.day` - Day shift (yellow background)
- `.cell.night` - Night shift (blue background)  
- `.cell.off` - Day off (green background)
- `.cell.today` - Current date highlight
- `.status-indicator` - Data presence indicator

### Form Components

#### Machine Management
```javascript
function renderMachines() {
  machinesList.innerHTML = '';
  state.machines = state.machines.slice().sort((a,b)=>a.localeCompare(b,'ru'));
  // Render sorted machine list with edit/delete controls
}
```

#### Parts Management
```javascript
function renderParts() {
  partsContainer.innerHTML = '';
  state.parts = state.parts.slice().sort((a,b)=> (a.name||'').localeCompare(b.name||'', 'ru'));
  // Render sorted parts list with operation management
}
```

## Service Worker

### Cache Strategy
- **Precache**: Core app shell files
- **Runtime Cache**: Dynamic content and API responses
- **Network First**: HTML navigation requests
- **Cache First**: Static assets

### Update Mechanism
```javascript
// Automatic update detection and reload
registration.addEventListener('updatefound', () => {
  const newWorker = registration.installing;
  newWorker.addEventListener('statechange', () => {
    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
      window.location.reload();
    }
  });
});
```

### Assets Cached
```javascript
const ASSETS = [
  '/pwa-app/',
  '/pwa-app/index.html',
  '/pwa-app/styles.css', 
  '/pwa-app/app.js',
  '/pwa-app/manifest.webmanifest',
  '/pwa-app/assets/icons/icon.svg'
];
```

## Storage System

### LocalStorage Key
```javascript
const STORAGE_KEY = 'pwa-settings-v1';
```

### Data Persistence
- Automatic save on all state changes
- JSON serialization with error handling
- Fallback to default state on corruption

### Backup/Restore
- JSON export with metadata
- Validation on import
- UI state refresh after import

## Calendar System

### Shift Cycle Configuration
```javascript
const CYCLE = ['D','D','O','O','D','D','O','O','N','N','O','O','N','N','O','O'];
const ANCHOR = new Date(Date.UTC(2025, 9, 11)); // October 11, 2025
const SHIFT_OFFSETS = { 1: 8, 2: 0, 3: 2, 4: 3 };
```

### Holiday Management
- Predefined holidays for 2025
- Dynamic holiday calculation for other years
- Visual indicators on calendar

### Navigation
```javascript
prevMonth?.addEventListener('click', () => { 
  current.setMonth(current.getMonth()-1); 
  renderCalendar(); 
});

nextMonth?.addEventListener('click', () => { 
  current.setMonth(current.getMonth()+1); 
  renderCalendar(); 
});
```

## Reporting System

### Report Types

#### Efficiency Report
```javascript
function generateEfficiencyReport(monthRecords, year, month, monthNames) {
  // Calculates work efficiency coefficient
  // Compares actual vs expected work time
  // Returns formatted HTML report
}
```

#### Parts Production Report
```javascript
function generatePartsReport(monthRecords, year, month, monthNames) {
  // Analyzes parts production statistics
  // Groups by part and operation
  // Shows quantities and time spent
}
```

#### Machine Utilization Report
```javascript
function generateMachinesReport(monthRecords, year, month, monthNames) {
  // Tracks machine usage statistics
  // Shows work days and total time per machine
  // Calculates utilization metrics
}
```

#### Daily Productivity Report
```javascript
function generateProductivityReport(monthRecords, year, month, monthNames) {
  // Day-by-day productivity analysis
  // Shows work time and parts produced
  // Includes shift type information
}
```

#### Overtime Report
```javascript
function generateOvertimeReport(monthRecords, year, month, monthNames) {
  // Identifies work on days off
  // Separates regular work from overtime
  // Provides overtime statistics
}
```

#### Quality Analysis Report
```javascript
function generateQualityReport(monthRecords, year, month, monthNames) {
  // Analyzes operation efficiency
  // Calculates average times per operation
  // Identifies areas for improvement
}
```

## Usage Examples

### Basic Setup
```javascript
// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  // Load saved state
  state = loadState();
  
  // Initialize UI
  hydrateMain();
  bindMain();
  renderMachines();
  renderParts();
});
```

### Adding a Machine
```javascript
// Add new machine
const machineName = "CNC-001";
state.machines.push(machineName);
saveState();
renderMachines();
```

### Creating a Part with Operations
```javascript
// Create new part
const newPart = {
  id: crypto.randomUUID(),
  name: "Gear Wheel",
  operations: [
    {
      name: "Rough Machining",
      machineTime: 15.5,
      extraTime: 3.0
    },
    {
      name: "Finish Machining", 
      machineTime: 8.2,
      extraTime: 1.5
    }
  ]
};

state.parts.push(newPart);
saveState();
renderParts();
```

### Recording Production Data
```javascript
// Create production record
const productionEntry = {
  machine: "CNC-001",
  part: "Gear Wheel",
  operation: "Rough Machining",
  machineTime: 15.5,
  extraTime: 3.0,
  quantity: 5,
  totalTime: calculateTotalTime(15.5, 3.0, 5) // 92.5 minutes
};

const record = {
  id: crypto.randomUUID(),
  date: "2025-10-18",
  shiftType: getShiftType(new Date("2025-10-18")),
  entries: [productionEntry]
};

state.records.push(record);
saveState();
```

### Generating Reports
```javascript
// Generate efficiency report for current month
const now = new Date();
const monthString = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
const reportHTML = generateReport(monthString, 'efficiency');

// Display in report dialog
document.getElementById('reportContent').innerHTML = reportHTML;
```

### Data Export/Import
```javascript
// Export data
exportAppData(); // Downloads JSON file

// Import data
const fileInput = document.getElementById('importFile');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const result = await importAppData(file);
      console.log(result); // "Data imported successfully"
    } catch (error) {
      console.error('Import failed:', error);
    }
  }
});
```

### Working with Calendar
```javascript
// Check if date is a work day
const date = new Date('2025-10-18');
const shiftType = getShiftType(date);
const isWorkDay = shiftType === 'D' || shiftType === 'N';

// Check for holidays
const isHolidayDate = isHoliday(date);

// Navigate calendar
function goToMonth(year, month) {
  current = new Date(year, month - 1, 1);
  renderCalendar();
}
```

This documentation provides a comprehensive overview of all public APIs, functions, and components in the Смена+ PWA application. Each section includes detailed explanations, parameter descriptions, return values, and practical usage examples.