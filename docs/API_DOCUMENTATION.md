# PWA Shift Manager - API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Core Functions](#core-functions)
3. [Data Management](#data-management)
4. [UI Components](#ui-components)
5. [Calendar Functions](#calendar-functions)
6. [Record Management](#record-management)
7. [Report Generation](#report-generation)
8. [Export/Import Functions](#export-import-functions)
9. [Service Worker API](#service-worker-api)
10. [Usage Examples](#usage-examples)

## Overview

The PWA Shift Manager is a Progressive Web Application designed for managing work shifts, tracking production data, and generating reports. It uses vanilla JavaScript with a modular architecture and provides offline functionality through Service Workers.

## Core Functions

### State Management

#### `loadState()`
Loads the application state from localStorage.

**Returns:** `Object` - The application state with the following structure:
```javascript
{
  main: {
    operatorName: string,    // Operator's full name
    shiftNumber: number,     // Shift number (1-4)
    baseTime: number        // Base time in minutes
  },
  machines: string[],       // Array of machine names
  parts: [                  // Array of parts
    {
      id: string,          // Unique identifier
      name: string,        // Part name
      operations: [        // Array of operations
        {
          name: string,        // Operation name
          machineTime: number, // Machine time in minutes
          extraTime: number    // Extra time in minutes
        }
      ]
    }
  ],
  records: [               // Array of work records
    {
      id: string,          // Unique identifier
      date: string,        // Date in YYYY-MM-DD format
      shiftType: string,   // 'D' (day), 'N' (night), or 'O' (off)
      entries: [           // Array of work entries
        {
          machine: string,
          part: string,
          operation: string,
          machineTime: number,
          extraTime: number,
          quantity: number,
          totalTime: number
        }
      ]
    }
  ]
}
```

**Example:**
```javascript
const state = loadState();
console.log(state.main.operatorName); // "Иванов И.И."
```

#### `saveState()`
Saves the current application state to localStorage.

**Example:**
```javascript
state.main.operatorName = "Петров П.П.";
saveState();
```

## Data Management

### Machine Management

#### `renderMachines()`
Renders the list of machines in the UI, sorted alphabetically.

**Example:**
```javascript
state.machines.push("Токарный станок");
saveState();
renderMachines();
```

### Part Management

#### `renderParts()`
Renders the list of parts in the UI, sorted alphabetically by name.

**Example:**
```javascript
state.parts.push({
  id: crypto.randomUUID(),
  name: "Вал-шестерня",
  operations: []
});
saveState();
renderParts();
```

#### `openOperationsDialog(partIndex)`
Opens the operations dialog for editing a specific part.

**Parameters:**
- `partIndex` (number): Index of the part in the state.parts array

**Example:**
```javascript
openOperationsDialog(0); // Opens dialog for the first part
```

#### `renderOperations()`
Renders the operations list for the currently selected part.

## UI Components

### Dialog Management

#### `openAddRecordDialog(date, isEditMode)`
Opens the dialog for adding or editing work records.

**Parameters:**
- `date` (string, optional): Date in YYYY-MM-DD format
- `isEditMode` (boolean, optional): Whether in edit mode

**Example:**
```javascript
openAddRecordDialog('2025-10-15', false); // Add new record
openAddRecordDialog('2025-10-15', true);  // Edit existing record
```

#### `showOvertimeDialog()`
Shows the overtime confirmation dialog for work on days off.

**Example:**
```javascript
if (shiftType === 'O') {
  showOvertimeDialog();
}
```

### Tab Navigation

#### `selectTab(key)`
Switches between settings tabs.

**Parameters:**
- `key` (string): Tab identifier ('main', 'machines', 'parts', 'export')

**Example:**
```javascript
selectTab('machines'); // Switch to machines tab
```

## Calendar Functions

### Shift Calculation

#### `getShiftType(date)`
Determines the shift type for a given date based on the 16-day cycle.

**Parameters:**
- `date` (Date): The date to check

**Returns:** `string` - 'D' (day shift), 'N' (night shift), or 'O' (off day)

**Example:**
```javascript
const shiftType = getShiftType(new Date('2025-10-15'));
console.log(shiftType); // 'D', 'N', or 'O'
```

#### `renderCalendar()`
Renders the calendar view with shift indicators and data status.

**Example:**
```javascript
current = new Date(); // Set current month
current.setDate(1);
renderCalendar();
```

### Holiday Management

#### `isHoliday(date)`
Checks if a date is a Russian national holiday.

**Parameters:**
- `date` (Date): The date to check

**Returns:** `boolean` - true if holiday, false otherwise

**Example:**
```javascript
const isNewYear = isHoliday(new Date('2025-01-01')); // true
```

## Record Management

### Entry Operations

#### `calculateTotalTime(machineTime, extraTime, quantity)`
Calculates the total time for a work entry.

**Parameters:**
- `machineTime` (number): Machine time in minutes
- `extraTime` (number): Extra time in minutes
- `quantity` (number): Number of items produced

**Returns:** `number` - Total time in minutes

**Example:**
```javascript
const total = calculateTotalTime(10, 5, 20); // 300 minutes
```

#### `calculateCoefficient(totalTime, baseTime)`
Calculates the efficiency coefficient.

**Parameters:**
- `totalTime` (number): Total work time in minutes
- `baseTime` (number): Base time in minutes

**Returns:** `number` - Efficiency coefficient (rounded to 2 decimals)

**Example:**
```javascript
const coefficient = calculateCoefficient(480, 600); // 0.80
```

### Record Display

#### `showResults(date)`
Displays work results for a specific date.

**Parameters:**
- `date` (string): Date in YYYY-MM-DD format

**Example:**
```javascript
showResults('2025-10-15'); // Shows all entries for October 15, 2025
```

#### `formatDate(dateInput)`
Formats a date to Russian locale string.

**Parameters:**
- `dateInput` (string|Date): Date to format

**Returns:** `string` - Formatted date (DD.MM.YYYY)

**Example:**
```javascript
const formatted = formatDate('2025-10-15'); // "15.10.2025"
```

### Entry Management

#### `editEntry(date, entryIndex)`
Opens the edit dialog for a specific entry.

**Parameters:**
- `date` (string): Date in YYYY-MM-DD format
- `entryIndex` (number): Index of the entry to edit

**Example:**
```javascript
editEntry('2025-10-15', 0); // Edit first entry of the date
```

#### `deleteEntry(date, entryIndex)`
Deletes a specific entry after confirmation.

**Parameters:**
- `date` (string): Date in YYYY-MM-DD format
- `entryIndex` (number): Index of the entry to delete

**Example:**
```javascript
deleteEntry('2025-10-15', 0); // Delete first entry
```

## Report Generation

### Report Functions

#### `generateReport(monthString, reportType)`
Generates a report for the specified month and type.

**Parameters:**
- `monthString` (string): Month in YYYY-MM format
- `reportType` (string): Type of report ('efficiency', 'parts', 'machines', 'productivity', 'overtime', 'quality')

**Example:**
```javascript
generateReport('2025-10', 'efficiency'); // October 2025 efficiency report
```

### Report Types

#### `generateEfficiencyReport(monthRecords, year, month, monthNames)`
Generates an efficiency coefficient report.

**Parameters:**
- `monthRecords` (Array): Records for the month
- `year` (number): Year
- `month` (number): Month (1-12)
- `monthNames` (Array): Array of month names

**Returns:** `string` - HTML content for the report

#### `generatePartsReport(monthRecords, year, month, monthNames)`
Generates a report of produced parts.

**Returns:** `string` - HTML content showing parts production statistics

#### `generateMachinesReport(monthRecords, year, month, monthNames)`
Generates a machine utilization report.

**Returns:** `string` - HTML content showing machine usage statistics

#### `generateProductivityReport(monthRecords, year, month, monthNames)`
Generates daily productivity report.

**Returns:** `string` - HTML content showing productivity by day

#### `generateOvertimeReport(monthRecords, year, month, monthNames)`
Generates overtime and weekend work report.

**Returns:** `string` - HTML content showing overtime statistics

#### `generateQualityReport(monthRecords, year, month, monthNames)`
Generates work quality analysis report.

**Returns:** `string` - HTML content showing quality metrics

## Export/Import Functions

### Data Export

#### `exportAppData()`
Exports all application data to a JSON file.

**Example:**
```javascript
exportAppData(); // Downloads pwa-backup-YYYY-MM-DD.json
```

**Export Format:**
```javascript
{
  version: "1.0",
  timestamp: "2025-10-15T12:00:00.000Z",
  data: {
    main: { /* main settings */ },
    machines: [ /* machines array */ ],
    parts: [ /* parts array */ ],
    records: [ /* records array */ ]
  }
}
```

### Data Import

#### `importAppData(file)`
Imports application data from a JSON file.

**Parameters:**
- `file` (File): The file to import

**Returns:** `Promise<string>` - Success or error message

**Example:**
```javascript
const file = document.getElementById('importFile').files[0];
importAppData(file)
  .then(message => console.log(message))
  .catch(error => console.error(error));
```

#### `showImportStatus(message, type)`
Shows import status message to the user.

**Parameters:**
- `message` (string): Status message
- `type` (string, optional): Message type ('info', 'success', 'error')

**Example:**
```javascript
showImportStatus('Data imported successfully', 'success');
```

## Service Worker API

### Cache Management

#### Cache Names
- `PRECACHE`: Contains pre-cached application shell
- `RUNTIME_CACHE`: Contains dynamically cached resources

#### Cached Assets
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

### Service Worker Events

#### Install Event
Pre-caches application shell and skips waiting.

#### Activate Event
Cleans old caches and claims all clients.

#### Fetch Event
Implements cache-first strategy for static assets and network-first for navigation.

## Usage Examples

### Complete Workflow Example

```javascript
// 1. Initialize application
document.addEventListener('DOMContentLoaded', () => {
  // Load state
  const state = loadState();
  
  // Set up operator
  state.main.operatorName = "Иванов И.И.";
  state.main.shiftNumber = 1;
  state.main.baseTime = 600;
  
  // Add machines
  state.machines = ["Токарный", "Фрезерный", "Сверлильный"];
  
  // Add parts with operations
  state.parts.push({
    id: crypto.randomUUID(),
    name: "Вал-шестерня",
    operations: [
      {
        name: "Точение",
        machineTime: 15,
        extraTime: 5
      },
      {
        name: "Фрезерование",
        machineTime: 20,
        extraTime: 10
      }
    ]
  });
  
  // Save state
  saveState();
  
  // Update UI
  hydrateMain();
  renderMachines();
  renderParts();
});

// 2. Add work record
function addWorkRecord() {
  const date = '2025-10-15';
  const record = {
    id: crypto.randomUUID(),
    date: date,
    shiftType: getShiftType(new Date(date)),
    entries: [
      {
        machine: "Токарный",
        part: "Вал-шестерня",
        operation: "Точение",
        machineTime: 15,
        extraTime: 5,
        quantity: 10,
        totalTime: calculateTotalTime(15, 5, 10)
      }
    ]
  };
  
  state.records.push(record);
  saveState();
  showResults(date);
}

// 3. Generate monthly report
function generateMonthlyReport() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  generateReport(currentMonth, 'efficiency');
}

// 4. Export data for backup
function backupData() {
  exportAppData();
}
```

### Adding Custom Operations

```javascript
// Add a new part with multiple operations
function addComplexPart() {
  const newPart = {
    id: crypto.randomUUID(),
    name: "Корпус редуктора",
    operations: [
      { name: "Черновая обработка", machineTime: 30, extraTime: 10 },
      { name: "Чистовая обработка", machineTime: 45, extraTime: 15 },
      { name: "Сверление отверстий", machineTime: 20, extraTime: 5 },
      { name: "Нарезание резьбы", machineTime: 15, extraTime: 5 }
    ]
  };
  
  state.parts.push(newPart);
  saveState();
  renderParts();
}
```

### Custom Report Generation

```javascript
// Generate a custom report for specific machines
function generateCustomMachineReport(machineName, startDate, endDate) {
  const filteredRecords = state.records.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate >= startDate && recordDate <= endDate &&
           record.entries.some(entry => entry.machine === machineName);
  });
  
  let totalTime = 0;
  let totalParts = 0;
  
  filteredRecords.forEach(record => {
    record.entries
      .filter(entry => entry.machine === machineName)
      .forEach(entry => {
        totalTime += entry.totalTime;
        totalParts += entry.quantity;
      });
  });
  
  return {
    machine: machineName,
    period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
    totalTime: totalTime,
    totalParts: totalParts,
    efficiency: calculateCoefficient(totalTime, state.main.baseTime * filteredRecords.length)
  };
}
```