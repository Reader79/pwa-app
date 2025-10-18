# UI Structure and Components

This application is built with plain HTML/CSS/JS. Components below are DOM elements identified by IDs/classes used in `app.js`.

## Navigation and actions
- `#actionOne`: Opens data entry/calendar
- `#actionTwo`: Opens reports dialog
- `#actionThree`: Placeholder action

## Tabs
- `.tab[data-tab]`: Tab buttons; active tab has class `active` and `aria-selected="true"`
- `.tab-panel[data-panel]`: Content panels; hidden panels have class `hidden`

## Settings dialog
- `#settingsButton`, `#settingsDialog`, `#closeSettings`
- Inputs: `#operatorName` (text), `#shiftNumber` (1..4), `#baseTime` (minutes)
- Behavior: inputs update `state.main` and persist automatically

## Machines management
- `#addMachine` (button), `#newMachine` (input), `#machinesList` (list)
- Each machine renders as an editable input with a delete button

## Parts and operations
- `#addPart`, `#newPart`, `#partsContainer`
- `#operationsDialog`, `#closeOperations`, `#operationsContainer`
- In the operations dialog:
  - Per-part name input (live updates)
  - Operation rows with: name, machineTime, extraTime, computed total, delete action
  - "Добавить операцию" button to append operations

## Add record dialog
- `#addRecordDialog`, `#closeAddRecord`
- Inputs:
  - `#recordDate` (YYYY-MM-DD)
  - `#recordMachine` (select from machines)
  - `#recordPart` (select from parts)
  - `#recordOperation` (select from part operations)
  - `#recordMachineTime`, `#recordExtraTime`, `#recordQuantity`
  - `#totalTimeDisplay` (computed)
- Buttons:
  - `#addRecordEntry` (unused in current code; entries are saved via `#saveRecord`)
  - `#saveRecord` saves via `saveRecordEntry()`
- Unsaved entries list:
  - `#entriesList` (container visibility) and `#entriesContainer` (rows)
  - Rows include a delete button calling `window.removeEntry(index)`

## Data entry/calendar dialog
- `#dataDialog`, `#closeData`
- Calendar elements:
  - `#monthLabel`, `#prevMonth`, `#nextMonth`
  - `#calendar` (grid of day cells)
  - Day cell classes: `day`, `night`, `off`, and `today` when applicable
  - Status indicator element appended for past workdays: `div.status-indicator.has-data` or `.no-data`
- "Add from calendar" button: `#addRecordFromCalendar` opens add-record dialog (with overtime confirmation on off days)

## Overtime confirmation dialog
- `#overtimeDialog`, `#closeOvertime`, `#confirmOvertime`, `#cancelOvertime`

## Reports dialog
- `#reportsDialog`, `#closeReports`
- Inputs: `#reportMonth` (YYYY-MM), `#reportType` (select)
- Output container: `#reportContent`
- Report types: `efficiency`, `parts`, `machines`, `productivity`, `overtime`, `quality`

## Results section
- `#resultsSection` (container toggled visible when a record exists)
- `#resultsTitle` (date + shift type)
- `#resultsContainer` (machine cards)
- Card classes:
  - `.machine-card` with `.machine-header`
  - `.operations-container` containing `.operation-card`
  - `.operation-header` with `.part-name` and `.part-number`
  - `.operation-data` and `.action-buttons`

## Styling notes
- The code expects CSS variables like `--card`, `--border-radius-sm`, and theme colors to be defined in `styles.css`.
- Elements are styled inline in several places (e.g., operation total display) to match the dark theme.

## User flows
- Add/edit records: Select a date on the calendar, click the "Добавить запись" button, fill fields, Save.
- Manage machines/parts: Use the settings tabs to add/edit/remove items.
- Generate reports: Open the reports dialog, pick month/type; content updates automatically.
- Import/export: Use the buttons in the import/export section to download a JSON backup or import one.
