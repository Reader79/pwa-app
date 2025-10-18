# PWA Shift Manager - API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [State Management](#state-management)
4. [Calendar & Shift Management](#calendar--shift-management)
5. [Record Management](#record-management)
6. [Report Generation](#report-generation)
7. [Data Import/Export](#data-importexport)
8. [UI Components](#ui-components)
9. [Service Worker](#service-worker)
10. [Usage Examples](#usage-examples)

---

## Overview

The PWA Shift Manager is a Progressive Web Application designed for managing work shifts, tracking production operations, and generating comprehensive reports. The application supports offline functionality, data persistence through localStorage, and provides a modern, responsive UI.

### Key Features
- 📅 **Shift Calendar**: 16-day cycle shift scheduling with visual indicators
- ⚙️ **Machine Management**: Track and manage multiple machines
- 🔧 **Parts & Operations**: Define parts with detailed operation specifications
- 📊 **Time Tracking**: Record work hours with automatic coefficient calculations
- 📈 **Reports**: Six different report types for production analysis
- 💾 **Data Persistence**: LocalStorage with import/export capabilities
- 🌐 **PWA Support**: Offline-first with Service Worker caching
- 🎨 **Responsive Design**: Works on desktop, tablet, and mobile devices

---

## Architecture

### Technology Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Storage**: LocalStorage API
- **PWA**: Service Worker, Web App Manifest
- **Build**: No build step required (vanilla JS)

### File Structure
```
/
├── index.html              # Main HTML structure
├── app.js                  # Application logic
├── styles.css              # Styling and theme
├── sw.js                   # Service Worker
├── manifest.webmanifest    # PWA manifest
└── assets/
    └── icons/
        └── icon.svg        # Application icon
```

### Data Model

```javascript
{
  main: {
    operatorName: String,    // Operator's name
    shiftNumber: Number,     // 1-4 shift number
    baseTime: Number         // Base time in minutes (default: 600)
  },
  machines: [String],        // Array of machine names
  parts: [                   // Array of part objects
    {
      id: String,            // Unique identifier
      name: String,          // Part name
      operations: [          // Array of operations
        {
          name: String,      // Operation name
          machineTime: Number,   // Machine time in minutes
          extraTime: Number      // Additional time in minutes
        }
      ]
    }
  ],
  records: [                 // Array of work records
    {
      id: String,            // Unique identifier
      date: String,          // ISO date string (YYYY-MM-DD)
      shiftType: String,     // 'D' (day), 'N' (night), 'O' (off)
      entries: [             // Array of work entries
        {
          machine: String,
          part: String,
          operation: String,
          machineTime: Number,
          extraTime: Number,
          quantity: Number,
          totalTime: Number  // Calculated: (machineTime + extraTime) * quantity
        }
      ]
    }
  ]
}
```

---

## State Management

### Core Functions

#### `loadState()`
Loads application state from localStorage.

**Returns**: `Object` - The application state

**Example**:
```javascript
const state = loadState();
console.log(state.main.operatorName); // "Иванов И.И."
```

**Implementation Details**:
- Returns deep clone of `defaultState` if no data exists
- Handles JSON parsing errors gracefully
- Merges with default state to ensure all properties exist

---

#### `saveState()`
Saves current application state to localStorage.

**Parameters**: None (uses global `state` variable)

**Example**:
```javascript
state.main.operatorName = "Петров П.П.";
saveState();
```

**Storage Key**: `pwa-settings-v1`

---

### State Constants

#### `STORAGE_KEY`
```javascript
const STORAGE_KEY = 'pwa-settings-v1';
```
LocalStorage key for persisting application data.

#### `defaultState`
```javascript
const defaultState = {
  main: { operatorName: '', shiftNumber: 1, baseTime: 600 },
  machines: [],
  parts: [],
  records: []
};
```
Default state structure when no saved data exists.

---

## Calendar & Shift Management

### Shift Scheduling

#### `getShiftType(date)`
Calculates the shift type for a given date based on a 16-day cycle.

**Parameters**:
- `date` (Date): The date to check

**Returns**: `String` - One of:
- `'D'` - Day shift
- `'N'` - Night shift  
- `'O'` - Off day

**Shift Cycle Pattern**: `['D','D','O','O','D','D','O','O','N','N','O','O','N','N','O','O']`

**Anchor Date**: October 11, 2025 (UTC)

**Example**:
```javascript
const date = new Date('2025-10-15');
const shiftType = getShiftType(date);
console.log(shiftType); // 'D', 'N', or 'O'
```

**Shift Offsets by Number**:
```javascript
const SHIFT_OFFSETS = { 
  1: 8,  // Shift 1 starts with night
  2: 0,  // Shift 2 starts with day
  3: 2,  // Shift 3
  4: 3   // Shift 4
};
```

---

#### `getShiftTypeForRecord(date, shiftNumber)`
Alternative shift type calculation (legacy, kept for compatibility).

**Parameters**:
- `date` (String): ISO date string (YYYY-MM-DD)
- `shiftNumber` (Number): Shift number (1-4)

**Returns**: `String` - Shift type ('D', 'N', or 'O')

**Example**:
```javascript
const shiftType = getShiftTypeForRecord('2025-10-15', 1);
console.log(shiftType); // 'N'
```

---

### Calendar Rendering

#### `renderCalendar()`
Renders the monthly calendar view with shift indicators.

**Parameters**: None (uses global `current` date variable)

**Features**:
- Displays weekday headers (Monday-Sunday)
- Color-codes days by shift type
- Highlights today's date
- Shows holiday indicators
- Displays data status indicators (✓ or ✗)
- Clickable cells for date selection

**Visual Indicators**:
- 🟡 Yellow: Day shift
- 🔵 Blue: Night shift
- 🟢 Green: Off day
- 🟠 Orange border: Today
- 🔴 Red corner: Holiday
- ✓ Green circle: Has data
- ✗ Red circle: Missing data (past work days)

**Example**:
```javascript
renderCalendar(); // Renders current month
```

---

#### `formatMonth(date)`
Formats a date object into a localized month string.

**Parameters**:
- `date` (Date): The date to format

**Returns**: `String` - Localized month and year (e.g., "октябрь 2025")

**Example**:
```javascript
const formatted = formatMonth(new Date('2025-10-15'));
console.log(formatted); // "октябрь 2025"
```

---

#### `isHoliday(date)`
Checks if a given date is a Russian federal holiday.

**Parameters**:
- `date` (Date): The date to check

**Returns**: `Boolean` - True if holiday, false otherwise

**Holiday Data**:
- Loaded from `HOLIDAYS_BY_YEAR` Map
- Falls back to computed holidays for missing years
- Includes standard Russian holidays and transfers

**Example**:
```javascript
const newYear = new Date('2025-01-01');
console.log(isHoliday(newYear)); // true

const regularDay = new Date('2025-10-15');
console.log(isHoliday(regularDay)); // false
```

**2025 Holidays Include**:
- January 1-8: New Year holidays
- February 23: Defender of the Fatherland Day
- March 8: International Women's Day
- May 1, 2, 8, 9: Spring and Victory Days
- June 12, 13: Russia Day + transfer
- November 3, 4: Unity Day + transfer
- December 31: New Year's Eve transfer

---

### Calendar Navigation

#### `prevMonth` / `nextMonth` Event Handlers
Navigate between months in the calendar.

**Implementation**:
```javascript
prevMonth?.addEventListener('click', () => { 
  current.setMonth(current.getMonth() - 1); 
  renderCalendar(); 
});

nextMonth?.addEventListener('click', () => { 
  current.setMonth(current.getMonth() + 1); 
  renderCalendar(); 
});
```

---

## Record Management

### Record Creation and Editing

#### `openAddRecordDialog(date, isEditMode)`
Opens the dialog for adding or editing work records.

**Parameters**:
- `date` (String, optional): ISO date string (YYYY-MM-DD)
- `isEditMode` (Boolean, optional): True when editing existing entry

**Features**:
- Pre-fills date or uses today's date
- Displays shift type for selected date
- Populates dropdowns with machines, parts, and operations
- Auto-calculates total time
- Preserves field values in edit mode

**Example**:
```javascript
// Add new record
openAddRecordDialog('2025-10-15');

// Edit existing record
openAddRecordDialog('2025-10-15', true);
```

---

#### `saveRecordEntry()`
Saves a work record entry to the state.

**Validation**:
- All required fields must be filled
- Machine, part, operation, machine time, and quantity are required

**Modes**:
1. **Edit Mode**: Replaces existing entry at `editingEntryIndex`
2. **Add Mode**: Appends new entry to existing or creates new record

**Side Effects**:
- Calls `saveState()` to persist data
- Updates calendar indicators
- Refreshes results display
- Shows success alert

**Example**:
```javascript
// Fill form fields first
recordMachine.value = "Станок 1";
recordPart.value = "part-id-123";
recordOperation.value = "Сверление";
recordMachineTime.value = 15;
recordQuantity.value = 10;

// Save the record
saveRecordEntry();
```

---

#### `window.editEntry(date, entryIndex)`
Global function to edit a specific work entry.

**Parameters**:
- `date` (String): ISO date string
- `entryIndex` (Number): Index of entry in record.entries array

**Features**:
- Locates entry in state
- Pre-fills form with entry data
- Opens dialog in edit mode
- Sets `editingEntryIndex` for save operation

**Example**:
```javascript
// Called from HTML via onclick
<button onclick="editEntry('2025-10-15', 0)">Edit</button>
```

---

#### `window.deleteEntry(date, entryIndex)`
Global function to delete a specific work entry.

**Parameters**:
- `date` (String): ISO date string
- `entryIndex` (Number): Index of entry to delete

**Features**:
- Shows confirmation dialog
- Removes entry from state
- Deletes entire record if last entry removed
- Updates calendar and results display

**Example**:
```javascript
// Called from HTML via onclick
<button onclick="deleteEntry('2025-10-15', 0)">Delete</button>
```

---

### Time Calculations

#### `calculateTotalTime(machineTime, extraTime, quantity)`
Calculates total time for an operation.

**Parameters**:
- `machineTime` (Number): Machine time per unit (minutes)
- `extraTime` (Number): Additional time per unit (minutes)
- `quantity` (Number): Number of parts produced

**Returns**: `Number` - Total time in minutes

**Formula**: `(machineTime + extraTime) × quantity`

**Example**:
```javascript
const total = calculateTotalTime(15, 5, 10);
console.log(total); // 200 minutes
```

---

#### `calculateCoefficient(totalTime, baseTime)`
Calculates the work efficiency coefficient.

**Parameters**:
- `totalTime` (Number): Total work time (minutes)
- `baseTime` (Number): Base/expected time (minutes)

**Returns**: `Number` - Coefficient (rounded to 2 decimals)

**Formula**: `round((totalTime / baseTime) × 100) / 100`

**Special Cases**:
- Returns `0` if baseTime is 0 or undefined

**Example**:
```javascript
const coefficient = calculateCoefficient(650, 600);
console.log(coefficient); // 1.08

const undertime = calculateCoefficient(550, 600);
console.log(undertime); // 0.92
```

---

### Display Functions

#### `showResults(date)`
Displays work results for a specific date.

**Parameters**:
- `date` (String): ISO date string (YYYY-MM-DD)

**Features**:
- Groups entries by machine
- Displays detailed operation cards
- Shows edit/delete buttons for each entry
- Calculates and displays totals
- Shows overall efficiency coefficient

**Layout**:
- Machine cards (orange headers)
- Operation cards with part details
- Data rows (machine time, extra time, quantity, etc.)
- Action buttons (edit/delete)
- Summary card with totals

**Example**:
```javascript
showResults('2025-10-15');
// Displays results section with all entries for that date
```

---

#### `formatDate(dateInput)`
Formats a date for display in Russian locale.

**Parameters**:
- `dateInput` (String|Date): Date to format

**Returns**: `String` - Formatted date (DD.MM.YYYY)

**Example**:
```javascript
console.log(formatDate('2025-10-15')); // "15.10.2025"
console.log(formatDate(new Date())); // "18.10.2025"
```

---

## Report Generation

### Main Report Function

#### `generateReport(monthString, reportType)`
Generates a monthly report of the specified type.

**Parameters**:
- `monthString` (String): Month in YYYY-MM format (e.g., "2025-10")
- `reportType` (String): Report type identifier

**Report Types**:
- `'efficiency'` - Efficiency coefficient report
- `'parts'` - Produced parts summary
- `'machines'` - Machine utilization report
- `'productivity'` - Daily productivity breakdown
- `'overtime'` - Overtime and weekend work
- `'quality'` - Quality analysis report

**Example**:
```javascript
generateReport('2025-10', 'efficiency');
// Generates and displays efficiency report for October 2025
```

---

### Report Type Details

#### `generateEfficiencyReport(monthRecords, year, month, monthNames)`
Generates efficiency coefficient analysis.

**Calculates**:
- Total work days
- Total shifts in month
- Total work time
- Expected time (shifts × baseTime)
- Efficiency coefficient

**Visual Indicators**:
- Green: Coefficient ≥ 1.0 (met or exceeded target)
- Red: Coefficient < 1.0 (below target)

**Example Output**:
```
КОЭФФИЦИЕНТ ВЫРАБОТКИ - ОКТЯБРЬ 2025
Отработанных дней: 15
Всего смен в месяце: 20
Общее время работы: 9500 мин
Ожидаемое время: 12000 мин
Коэффициент выработки: 0.792
```

---

#### `generatePartsReport(monthRecords, year, month, monthNames)`
Lists all parts produced during the month.

**Groups By**: Part name and operation

**Shows**:
- Part name
- Operation name
- Total quantity produced
- Total time spent
- Machines used

**Sorting**: By total quantity (descending)

**Example Output**:
```
ПРОИЗВЕДЕННЫЕ ДЕТАЛИ - ОКТЯБРЬ 2025

Деталь: Втулка
Операция: Сверление
Количество: 150 шт
Время работы: 2250 мин
Станки: Станок 1, Станок 2
```

---

#### `generateMachinesReport(monthRecords, year, month, monthNames)`
Analyzes machine utilization and workload.

**For Each Machine**:
- Total work time
- Number of work days
- Total parts produced
- Variety of parts made

**Sorting**: By total time (descending)

**Example Output**:
```
ЗАГРУЗКА СТАНКОВ - ОКТЯБРЬ 2025

Станок: Станок 1
Время работы: 4500 мин
Рабочих дней: 15
Изготовлено деталей: 200 шт
Видов деталей: 5
```

---

#### `generateProductivityReport(monthRecords, year, month, monthNames)`
Daily productivity breakdown.

**For Each Work Day**:
- Day number
- Shift type (Day/Night/Off)
- Total work time
- Parts produced
- Number of operations

**Sorting**: By day of month (ascending)

**Example Output**:
```
ПРОИЗВОДИТЕЛЬНОСТЬ ПО ДНЯМ - ОКТЯБРЬ 2025

15 число: Дневная
Время работы: 600 мин
Изготовлено деталей: 50 шт
Операций: 5
```

---

#### `generateOvertimeReport(monthRecords, year, month, monthNames)`
Analyzes overtime and weekend work.

**Separates**:
- Regular work days (shift type D or N)
- Overtime days (shift type O with work)

**Shows**:
- Count of overtime days
- Total overtime hours
- List of specific overtime dates
- Regular work statistics

**Example Output**:
```
ПОДРАБОТКИ И ВЫХОДНЫЕ - ОКТЯБРЬ 2025

Подработок: 3 дней
Время подработок: 1800 мин
Обычных рабочих дней: 15 дней
Время обычной работы: 9000 мин

Дни подработок:
12.10: 600 мин, 40 деталей
```

---

#### `generateQualityReport(monthRecords, year, month, monthNames)`
Quality and efficiency analysis by operation.

**Calculates**:
- Total operations count
- Total time spent
- Average time per operation
- Per-operation breakdown

**Quality Indicators**:
- "Хорошо" (Good): Below average time
- "Требует внимания" (Needs attention): Above average time

**Sorting**: By average time (descending)

**Example Output**:
```
АНАЛИЗ КАЧЕСТВА РАБОТЫ - ОКТЯБРЬ 2025

Всего операций: 500
Общее время: 9000 мин
Среднее время на операцию: 18.0 мин

Втулка - Сверление: 150 шт
Среднее время: 15.0 мин
Эффективность: Хорошо
```

---

### Report Dialog Functions

#### `openReportsDialog()`
Opens the reports dialog with current month pre-selected.

**Features**:
- Auto-fills current month
- Sets default report type (efficiency)
- Generates initial report
- Opens modal dialog

**Example**:
```javascript
openReportsDialog();
```

---

## Data Import/Export

### Export Function

#### `exportAppData()`
Exports all application data as JSON file.

**Export Structure**:
```javascript
{
  version: '1.0',
  timestamp: '2025-10-18T12:00:00.000Z',
  data: {
    main: { /* operator settings */ },
    machines: [ /* machine list */ ],
    parts: [ /* parts with operations */ ],
    records: [ /* work records */ ]
  }
}
```

**File Name Format**: `pwa-backup-YYYY-MM-DD.json`

**Features**:
- Pretty-printed JSON (2-space indent)
- Includes metadata (version, timestamp)
- Auto-downloads file
- Cross-browser compatible

**Example**:
```javascript
exportAppData();
// Downloads: pwa-backup-2025-10-18.json
```

---

### Import Function

#### `importAppData(file)`
Imports application data from JSON file.

**Parameters**:
- `file` (File): JSON file to import

**Returns**: `Promise<String>` - Success message or throws error

**Validation**:
- Checks for required properties (version, data)
- Validates JSON structure
- Handles missing properties with defaults

**Side Effects**:
- Updates global state
- Saves to localStorage
- Re-renders UI components

**Example**:
```javascript
const file = document.getElementById('importFile').files[0];
try {
  const result = await importAppData(file);
  console.log(result); // "Данные успешно импортированы"
} catch (error) {
  console.error('Import failed:', error);
}
```

---

#### `showImportStatus(message, type)`
Displays import/export status message.

**Parameters**:
- `message` (String): Status message
- `type` (String): One of 'info', 'success', 'error'

**Duration**: 5 seconds auto-hide

**Styling**:
- Info: Blue background
- Success: Green background
- Error: Red background

**Example**:
```javascript
showImportStatus('Данные успешно импортированы', 'success');
showImportStatus('Ошибка импорта', 'error');
```

---

## UI Components

### Main Settings Management

#### `hydrateMain()`
Populates main settings form with current state values.

**Fields Updated**:
- Operator name
- Shift number
- Base time

**Example**:
```javascript
hydrateMain();
// Fills form: operatorName.value = state.main.operatorName
```

---

#### `bindMain()`
Binds event listeners to main settings inputs.

**Events**:
- `operatorName.input` → Updates state and re-renders calendar
- `shiftNumber.change` → Updates state and re-renders calendar
- `baseTime.input` → Updates state
- Prevents Enter key form submission

**Example**:
```javascript
bindMain();
// Now typing in inputs auto-saves to state
```

---

### Machine Management

#### `renderMachines()`
Renders the list of machines with edit/delete controls.

**Features**:
- Alphabetically sorted (Russian locale)
- Inline editing (input fields)
- Delete buttons
- Auto-save on input

**Example**:
```javascript
renderMachines();
// Displays all machines in sorted order
```

---

#### `addMachine` Event Handler
Adds a new machine to the list.

**Validation**: Non-empty name required

**Example**:
```javascript
newMachine.value = "Станок 5";
addMachine.click(); // Adds machine and clears input
```

---

### Parts Management

#### `renderParts()`
Renders the list of parts with action buttons.

**Features**:
- Alphabetically sorted by name (Russian locale)
- Edit button (opens operations dialog)
- Delete button (with confirmation)
- Clean card-based layout

**Example**:
```javascript
renderParts();
// Displays all parts with operations count
```

---

#### `openOperationsDialog(partIndex)`
Opens dialog to edit part details and operations.

**Parameters**:
- `partIndex` (Number): Index of part in state.parts array

**Features**:
- Edit part name (inline)
- Add/edit/delete operations
- Real-time time sum calculation
- Grid layout for operation fields

**Example**:
```javascript
openOperationsDialog(0);
// Opens editor for first part
```

---

#### `renderOperations()`
Renders operations list within the operations dialog.

**Features**:
- Part name editor
- Operation rows (name, machine time, extra time, total)
- Add operation button
- Delete operation buttons
- Auto-calculated totals

**Example**:
```javascript
renderOperations();
// Displays all operations for current part
```

---

### Tab System

#### `selectTab(key)`
Switches active tab in settings dialog.

**Parameters**:
- `key` (String): Tab identifier ('main', 'machines', 'parts', 'export')

**Features**:
- Updates tab visual state
- Shows/hides corresponding panels
- Sets ARIA attributes for accessibility

**Example**:
```javascript
selectTab('machines');
// Shows machines tab, hides others
```

---

### Dialog Controls

All dialogs use the `<dialog>` HTML element with `.showModal()` and `.close()` methods.

**Available Dialogs**:
- `settingsDialog` - Main settings
- `dataDialog` - Calendar and data entry
- `operationsDialog` - Part operations editor
- `addRecordDialog` - Work record entry
- `reportsDialog` - Report viewer
- `overtimeDialog` - Overtime confirmation

**Common Pattern**:
```javascript
// Open dialog
settingsDialog.showModal();

// Close dialog
settingsDialog.close();

// Close button
closeSettings.addEventListener('click', () => settingsDialog.close());
```

---

## Service Worker

### Configuration

#### Cache Versions
```javascript
const CACHE_VERSION = 'v59';
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;
const PRECACHE = `precache-${CACHE_VERSION}`;
```

#### Precached Assets
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

---

### Lifecycle Events

#### Install Event
Precaches essential app shell resources.

**Features**:
- Opens precache
- Adds all ASSETS to cache
- Calls `skipWaiting()` for immediate activation

---

#### Activate Event
Cleans up old caches and claims clients.

**Features**:
- Deletes outdated caches
- Claims all clients
- Sends update messages to clients
- Forces reload after 1 second

**Messages Sent**:
- `SW_UPDATED` - Immediate message
- `FORCE_RELOAD` - Delayed 1 second

---

#### Message Event
Handles messages from clients.

**Supported Messages**:
- `CHECK_UPDATE` - Triggers cache update

---

### Fetch Strategies

#### HTML Requests (Navigation)
**Strategy**: Network First, fallback to cache, then index.html

```javascript
if (isHtmlRequest(request)) {
  // Try network → update cache → return response
  // On error → return cached /pwa-app/index.html
}
```

#### Static Assets
**Strategy**: Cache First, fallback to network

```javascript
// Check cache first
// If miss → fetch from network → update cache
```

---

### Client-Side Integration

#### Registration
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(registration => {
      // Force update check
      registration.update();
      
      // Listen for updates
      registration.addEventListener('updatefound', ...);
    });
}
```

#### Update Detection
```javascript
// Listen for SW messages
navigator.serviceWorker.addEventListener('message', (event) => {
  if (event.data.type === 'SW_UPDATED') {
    window.location.reload();
  }
});

// Periodic update checks (every 30s)
setInterval(() => {
  registration.update();
}, 30000);
```

---

## Usage Examples

### Complete Workflow Example

#### 1. Initial Setup
```javascript
// Application loads
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

#### 2. Configure Operator Settings
```javascript
// User enters operator details
operatorName.value = "Иванов И.И.";
shiftNumber.value = "1";
baseTime.value = "600";

// Auto-saved via bound events
// state.main.operatorName = "Иванов И.И."
// state.main.shiftNumber = 1
// state.main.baseTime = 600
```

#### 3. Add Machines
```javascript
// Add multiple machines
const machines = ["Токарный 1", "Фрезерный 2", "Сверлильный 3"];
machines.forEach(name => {
  state.machines.push(name);
});
saveState();
renderMachines();
```

#### 4. Create Part with Operations
```javascript
// Create new part
const partId = crypto.randomUUID();
const newPart = {
  id: partId,
  name: "Втулка 12345",
  operations: [
    { name: "Точение", machineTime: 15, extraTime: 5 },
    { name: "Сверление", machineTime: 10, extraTime: 3 },
    { name: "Контроль", machineTime: 0, extraTime: 5 }
  ]
};

state.parts.push(newPart);
saveState();
renderParts();
```

#### 5. Record Work Entry
```javascript
// User clicks calendar date
const selectedDate = '2025-10-15';
openAddRecordDialog(selectedDate);

// User fills form
recordMachine.value = "Токарный 1";
recordPart.value = partId;  // ID of "Втулка 12345"
recordOperation.value = "Точение";
recordMachineTime.value = 15;
recordExtraTime.value = 5;
recordQuantity.value = 20;

// Save record
saveRecordEntry();
// Creates/updates record for 2025-10-15
// Adds entry: { machine: "Токарный 1", part: "Втулка 12345", 
//               operation: "Точение", machineTime: 15, extraTime: 5,
//               quantity: 20, totalTime: 400 }
```

#### 6. View Daily Results
```javascript
// Display results for specific date
showResults('2025-10-15');

// Output shows:
// - Grouped by machine
// - Each operation with details
// - Total time: 400 min
// - Coefficient: 0.667 (if baseTime = 600)
```

#### 7. Generate Monthly Report
```javascript
// Open reports dialog
openReportsDialog();

// Generate efficiency report
generateReport('2025-10', 'efficiency');

// Output shows:
// - Total work days
// - Total time worked
// - Efficiency coefficient
// - Color-coded performance
```

#### 8. Export Data
```javascript
// Export all data
exportAppData();
// Downloads: pwa-backup-2025-10-18.json

// File contains:
// {
//   version: '1.0',
//   timestamp: '2025-10-18T...',
//   data: { main: {...}, machines: [...], parts: [...], records: [...] }
// }
```

#### 9. Import Data
```javascript
// User selects file
const file = importFile.files[0];

// Import data
importAppData(file)
  .then(result => {
    showImportStatus(result, 'success');
    // All data restored
    // UI updated
  })
  .catch(error => {
    showImportStatus('Ошибка: ' + error.message, 'error');
  });
```

---

### Advanced Examples

#### Calculate Work Statistics
```javascript
// Get all records for current month
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;

const monthRecords = state.records.filter(record => {
  const recordDate = new Date(record.date);
  return recordDate.getFullYear() === year && 
         recordDate.getMonth() + 1 === month;
});

// Calculate total time
const totalTime = monthRecords.reduce((sum, record) => {
  return sum + record.entries.reduce((entrySum, entry) => {
    return entrySum + (entry.totalTime || 
                       (entry.machineTime + entry.extraTime) * entry.quantity);
  }, 0);
}, 0);

console.log(`Total time for ${month}/${year}: ${totalTime} minutes`);
```

---

#### Find Most Used Machine
```javascript
const machineUsage = {};

state.records.forEach(record => {
  record.entries.forEach(entry => {
    machineUsage[entry.machine] = (machineUsage[entry.machine] || 0) + entry.totalTime;
  });
});

const mostUsed = Object.entries(machineUsage)
  .sort(([,a], [,b]) => b - a)[0];

console.log(`Most used machine: ${mostUsed[0]} (${mostUsed[1]} minutes)`);
```

---

#### Efficiency Trend Analysis
```javascript
// Calculate efficiency for last 3 months
const months = [7, 8, 9]; // July, August, September
const efficiencies = months.map(month => {
  const records = state.records.filter(r => {
    const d = new Date(r.date);
    return d.getFullYear() === 2025 && d.getMonth() + 1 === month;
  });
  
  const totalTime = records.reduce((sum, r) => {
    return sum + r.entries.reduce((es, e) => es + e.totalTime, 0);
  }, 0);
  
  // Count work days in month (D or N shifts)
  const daysInMonth = new Date(2025, month, 0).getDate();
  let workDays = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(2025, month - 1, day);
    const shiftType = getShiftType(date);
    if (shiftType === 'D' || shiftType === 'N') workDays++;
  }
  
  const expectedTime = workDays * state.main.baseTime;
  const coefficient = calculateCoefficient(totalTime, expectedTime);
  
  return { month, coefficient };
});

console.log('Efficiency trend:', efficiencies);
// [{ month: 7, coefficient: 0.95 }, ...]
```

---

#### Validate Record Completeness
```javascript
// Check if all work days have records
function validateMonthRecords(year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const missingDays = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const shiftType = getShiftType(date);
    
    // Only check work days (D or N)
    if (shiftType === 'D' || shiftType === 'N') {
      const dateStr = date.toISOString().split('T')[0];
      const hasRecord = state.records.some(r => r.date === dateStr);
      
      if (!hasRecord) {
        missingDays.push({ date: dateStr, shiftType });
      }
    }
  }
  
  return missingDays;
}

const missing = validateMonthRecords(2025, 10);
console.log('Missing records:', missing);
```

---

### Debugging and Development

#### Enable Verbose Logging
```javascript
// Add to app.js for debugging
const DEBUG = true;

function log(...args) {
  if (DEBUG) console.log('[PWA]', ...args);
}

// Use in functions
function saveState() {
  log('Saving state:', state);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
```

---

#### Reset Application State
```javascript
// Clear all data (use with caution!)
function resetApp() {
  if (confirm('Удалить все данные? Это действие необнеобратимо!')) {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }
}

// Call from console or add to UI
// resetApp();
```

---

#### Test Shift Calculation
```javascript
// Test shift types for a range of dates
function testShiftCalculation(startDate, days) {
  const results = [];
  const start = new Date(startDate);
  
  for (let i = 0; i < days; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    
    const shiftType = getShiftType(date);
    results.push({
      date: date.toISOString().split('T')[0],
      shift: shiftType,
      name: shiftType === 'D' ? 'Day' : shiftType === 'N' ? 'Night' : 'Off'
    });
  }
  
  console.table(results);
  return results;
}

// Test shift cycle for October 2025
testShiftCalculation('2025-10-01', 31);
```

---

## Best Practices

### State Management
1. **Always call `saveState()` after modifying state**
   ```javascript
   state.machines.push("New Machine");
   saveState(); // Don't forget this!
   ```

2. **Use deep cloning for default state**
   ```javascript
   const newState = structuredClone(defaultState);
   ```

3. **Validate data before saving**
   ```javascript
   if (!recordMachine.value) {
     alert('Machine is required');
     return;
   }
   ```

### Performance
1. **Batch UI updates**
   ```javascript
   // Good: Single render call
   state.machines.push("M1", "M2", "M3");
   renderMachines();
   
   // Bad: Multiple renders
   state.machines.push("M1"); renderMachines();
   state.machines.push("M2"); renderMachines();
   ```

2. **Use event delegation for dynamic content**
   ```javascript
   // Good: One listener on parent
   calendar.addEventListener('click', (e) => {
     if (e.target.classList.contains('cell')) {
       handleCellClick(e.target);
     }
   });
   ```

### Accessibility
1. **Use ARIA attributes**
   ```javascript
   tab.setAttribute('aria-selected', 'true');
   dialog.setAttribute('aria-labelledby', 'dialogTitle');
   ```

2. **Keyboard navigation support**
   ```javascript
   input.addEventListener('keydown', (e) => {
     if (e.key === 'Enter') {
       submitForm();
     }
   });
   ```

### Error Handling
1. **Try-catch for localStorage operations**
   ```javascript
   try {
     const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
   } catch (error) {
     console.error('Failed to parse state:', error);
     return defaultState;
   }
   ```

2. **Validate imported data**
   ```javascript
   if (!importData.data || !importData.version) {
     throw new Error('Invalid file format');
   }
   ```

---

## Browser Compatibility

### Minimum Requirements
- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13.1+
- **Edge**: 80+

### Required APIs
- ✅ LocalStorage
- ✅ Service Worker
- ✅ Dialog Element
- ✅ ES6 (const, let, arrow functions, etc.)
- ✅ Fetch API
- ✅ Promises
- ✅ crypto.randomUUID (with polyfill fallback)

### Progressive Enhancement
The app gracefully degrades if certain features are unavailable:
- Without Service Worker: Still functions, but no offline support
- Without crypto.randomUUID: Falls back to Math.random() + timestamp

---

## Troubleshooting

### Common Issues

#### Data Not Persisting
**Problem**: Changes don't save after page reload
**Solution**: Check if `saveState()` is called after modifications

```javascript
// Add logging to verify
function saveState() {
  console.log('Saving state...', state);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  console.log('State saved successfully');
}
```

---

#### Calendar Not Updating
**Problem**: Calendar doesn't show new records
**Solution**: Call `renderCalendar()` after adding records

```javascript
saveRecordEntry();
renderCalendar(); // Add this
```

---

#### Service Worker Not Updating
**Problem**: Changes don't appear after deployment
**Solution**: 
1. Increment `CACHE_VERSION` in sw.js
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard reload (Ctrl+Shift+R)

---

#### Import Fails
**Problem**: "Invalid file format" error
**Solution**: Verify JSON structure matches export format

```javascript
// Valid structure
{
  "version": "1.0",
  "timestamp": "...",
  "data": {
    "main": {},
    "machines": [],
    "parts": [],
    "records": []
  }
}
```

---

## Appendix

### Glossary

- **Shift**: Work period (Day, Night, or Off)
- **Cycle**: 16-day repeating pattern of shifts
- **Base Time**: Expected work time per shift (default 600 min = 10 hours)
- **Coefficient**: Ratio of actual work time to expected time
- **Operation**: Single work task on a part
- **Entry**: Record of work performed (machine + part + operation)
- **Record**: Collection of entries for one date

### Russian Translations

| English | Russian |
|---------|---------|
| Day shift | Дневная смена |
| Night shift | Ночная смена |
| Off day | Выходной день |
| Machine | Станок |
| Part | Деталь |
| Operation | Операция |
| Machine time | Машинное время |
| Extra time | Дополнительное время |
| Quantity | Количество |
| Total time | Общее время |
| Coefficient | Коэффициент |

---

## Contributing

When extending the application:

1. **Follow existing patterns**
   - Use same state management approach
   - Follow naming conventions
   - Maintain consistent error handling

2. **Document new functions**
   - Add JSDoc comments
   - Update this API documentation
   - Include usage examples

3. **Test thoroughly**
   - Test on mobile devices
   - Verify offline functionality
   - Check cross-browser compatibility

4. **Update version numbers**
   - Increment in package.json
   - Update CACHE_VERSION in sw.js
   - Update version display in HTML

---

## License

MIT License - See LICENSE file for details

---

## Support

For questions or issues:
1. Check this documentation
2. Review console logs for errors
3. Verify browser compatibility
4. Check Service Worker status in DevTools

---

**Last Updated**: October 18, 2025  
**Version**: 0.1b  
**Author**: Reader79
