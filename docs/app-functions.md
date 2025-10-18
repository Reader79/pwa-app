# Application Functions Reference

This reference lists the key functions defined in `app.js`. Unless stated otherwise, functions are internal (not exported on `window`) and are invoked by UI events.

Notation: `string (YYYY-MM-DD)` denotes an ISO date string.

## State and persistence

### `loadState(): State`
Loads state from `localStorage` under `pwa-settings-v1`. Falls back to a fresh clone of `defaultState` on parse errors or missing data.

### `saveState(): void`
Persists the current `state` back to `localStorage` under `pwa-settings-v1`.

## Scheduling and time helpers

### `getShiftTypeForRecord(date: string, shiftNumber: number): 'D'|'N'|'O'`
Determines shift type using a 16-day cycle anchored at 2025-10-11. Used for display in the add-record dialog.

### `calculateTotalTime(machineTime: number, extraTime: number, quantity: number): number`
Computes total minutes as `(machineTime + extraTime) * quantity`.

### `calculateCoefficient(totalTime: number, baseTime: number): number`
Returns a rounded ratio `totalTime / baseTime` with two decimals (0 if `baseTime` is falsy or 0).

## Add record dialog and form utilities

### `openAddRecordDialog(date?: string, isEditMode = false): void`
Opens the add/edit record dialog, initializes fields, updates options and totals; preserves selections in edit mode.

### `updateShiftType(): void`
Updates the shift type label based on `recordDate` and current `state.main.shiftNumber`.

### `updateMachineOptions(): void`
Rebuilds machine `<select>` options from `state.machines`.

### `updatePartOptions(): void`
Rebuilds part `<select>` options from `state.parts`.

### `updateOperationOptions(): void`
Rebuilds operation `<select>` based on the selected part; carries per-option `data-machine-time`/`data-extra-time` via dataset.

### `updateTotalTime(): void`
Recomputes and displays the total minutes for the current form values.

### `showEntriesList(): void` / `hideEntriesList(): void`
Shows/hides the unsaved-entry list inside the dialog.

### `renderEntries(): void`
Renders the current unsaved entries (`currentEntries`) into the dialog list. Each row includes a delete button wired to `window.removeEntry(index)`.

### `removeEntry(index: number): void` (exported as `window.removeEntry`)
Removes an unsaved entry from `currentEntries`, updates list visibility.

### `saveRecordEntry(): void`
Validates required fields, computes a new entry from form controls, then either:
- edits an existing persisted entry (when in edit mode), or
- adds a new entry to an existing/new record for the selected date.
Finally saves state, closes the dialog, updates calendar and results.

## Edit/delete persisted entries (globals)

### `window.editEntry(date: string, entryIndex: number): void`
Pre-fills and opens the add-record dialog in edit mode for an existing persisted entry.

### `window.deleteEntry(date: string, entryIndex: number): void`
Deletes a persisted entry; removes the entire record if it becomes empty. Saves state and refreshes UI.

## Reports

### `openReportsDialog(): void`
Initializes the reports dialog (sets current month, default type), generates the initial report, and opens the dialog.

### `generateReport(month: string, reportType: 'efficiency'|'parts'|'machines'|'productivity'|'overtime'|'quality' = 'efficiency'): void`
Dispatches to a specific report generator and injects the returned HTML into `#reportContent`.

Report generators (return HTML strings):
- `generateEfficiencyReport(monthRecords, year, month, monthNames)`
- `generatePartsReport(monthRecords, year, month, monthNames)`
- `generateMachinesReport(monthRecords, year, month, monthNames)`
- `generateProductivityReport(monthRecords, year, month, monthNames)`
- `generateOvertimeReport(monthRecords, year, month, monthNames)`
- `generateQualityReport(monthRecords, year, month, monthNames)`

Usage example:
```js
// Show efficiency report for October 2025
generateReport('2025-10', 'efficiency');
```

## Results view

### `showResults(date: string): void`
Renders grouped results for a specific date into `#resultsSection`, including per-machine cards and a summary with a computed coefficient.

### `formatDate(dateOrString): string`
Formats a `Date` or `YYYY-MM-DD` string into `ru-RU` locale date.

## Settings and main view

### `hydrateMain(): void`
Populates settings inputs from `state.main`.

### `bindMain(): void`
Binds settings inputs (`operatorName`, `shiftNumber`, `baseTime`) to live-update the state, persist to storage, and refresh the calendar.

### `selectTab(key: string): void`
Activates the tab with `data-tab="key"` and shows the corresponding `.tab-panel[data-panel="key"]`.

## Machines and parts

### `renderMachines(): void`
Renders the machines list with editable inputs and per-item delete buttons; updates state on input.

### `renderParts(): void`
Renders parts with per-part actions to open the operations dialog or delete the part.

### `openOperationsDialog(partIndex: number): void`
Opens the operations dialog for the chosen part and renders its operations.

### `renderOperations(): void`
Renders operation rows (name, machineTime, extraTime, computed total) with live updates and a delete action; includes an add-operation button.

## Calendar and schedule

### `openDataEntry(): void`
Opens the data entry dialog and renders the calendar for the current month.

### `formatMonth(date: Date): string`
Formats the month header (ru-RU locale).

### `getShiftType(date: Date): 'D'|'N'|'O'`
Computes shift type for the given calendar date based on a 16-day cycle with per-shift offsets. Uses a UTC anchor date to avoid TZ drift.

### `renderCalendar(): void`
Builds the monthly calendar grid with day cells, shift marks, holiday corners, status indicators for past workdays, and click handlers to select a date and show results.

### `fmtDateISO(date: Date): string`
Formats a `Date` into `YYYY-MM-DD`.

### `addDays(date: Date, n: number): Date`
Returns a new date offset by `n` days.

### `computeDefaultHolidays(year: number): Set<string>`
Computes a default holiday set for a given year including statutory holidays and weekend carry-overs.

### `isHoliday(date: Date): boolean`
Checks if the given date is a holiday; uses a pre-populated map or computes defaults.

## Import/Export

### `exportAppData(): void`
Builds a versioned JSON payload with `main`, `machines`, `parts`, and `records`, then triggers a file download.

### `importAppData(file: File): Promise<string>`
Reads a JSON file, validates shape, replaces `state` sections, persists under `pwa-state`, hydrates UI, and resolves with a success message.

Example:
```js
const fileInput = document.querySelector('#importFile');
// After selecting a file via the UI, call the import button handler to start
```

### `showImportStatus(message: string, type: 'info'|'success'|'error' = 'info'): void`
Displays a transient status banner for import operations.

## Service worker registration

The app registers `./sw.js` on window `load`, listens for update events (`updatefound`), reloads when a new worker is installed, and periodically calls `registration.update()` every 30s.
