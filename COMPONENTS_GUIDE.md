# Смена+ PWA - Components Guide

## Table of Contents
1. [Overview](#overview)
2. [Dialog Components](#dialog-components)
3. [Form Components](#form-components)
4. [Calendar Component](#calendar-component)
5. [Display Components](#display-components)
6. [Navigation Components](#navigation-components)
7. [Styling System](#styling-system)
8. [Component Lifecycle](#component-lifecycle)

## Overview

The Смена+ PWA uses a component-based architecture built with vanilla JavaScript and HTML5. Components are managed through DOM manipulation and event handling, with a clear separation between data, presentation, and interaction logic.

## Dialog Components

### Settings Dialog (`#settingsDialog`)

**Purpose**: Main configuration interface with tabbed navigation

**HTML Structure**:
```html
<dialog id="settingsDialog" class="settings-dialog" aria-labelledby="settingsTitle">
  <form method="dialog" class="settings-content">
    <header class="settings-header">
      <h2 id="settingsTitle">Настройки</h2>
      <button class="icon-button" id="closeSettings" value="cancel">×</button>
    </header>
    <nav class="tabs" role="tablist">
      <!-- Tab buttons -->
    </nav>
    <section class="settings-body">
      <!-- Tab panels -->
    </section>
    <footer class="settings-footer">
      <!-- Action buttons -->
    </footer>
  </form>
</dialog>
```

**JavaScript Interface**:
```javascript
// Open settings dialog
settingsButton.addEventListener('click', () => {
  if (!settingsDialog.open) settingsDialog.showModal();
});

// Tab navigation
function selectTab(key) {
  tabs.forEach(t => { 
    t.classList.toggle('active', t.dataset.tab === key); 
    t.setAttribute('aria-selected', String(t.dataset.tab === key)); 
  });
  panels.forEach(p => p.classList.toggle('hidden', p.dataset.panel !== key));
}
```

**Features**:
- Modal dialog with backdrop blur
- Tabbed interface (Main, Machines, Parts, Export/Import)
- Form validation and auto-save
- Keyboard navigation support
- Responsive design

**Usage Example**:
```javascript
// Programmatically open settings
document.getElementById('settingsButton').click();

// Switch to specific tab
selectTab('machines');

// Close dialog
settingsDialog.close();
```

### Data Entry Dialog (`#addRecordDialog`)

**Purpose**: Production data entry with real-time calculations

**Key Features**:
- Date selection with shift type display
- Cascading dropdowns (Machine → Part → Operation)
- Auto-calculation of total time
- Form validation
- Edit mode support

**JavaScript Interface**:
```javascript
function openAddRecordDialog(date = null, isEditMode = false) {
  addRecordDialog.showModal();
  
  if (date) {
    recordDate.value = date;
  } else {
    recordDate.value = new Date().toISOString().split('T')[0];
  }
  
  updateShiftType();
  updateMachineOptions();
  updatePartOptions();
  updateOperationOptions();
  updateTotalTime();
}
```

**Form Fields**:
- `recordDate`: Date picker
- `recordMachine`: Machine selection
- `recordPart`: Part selection  
- `recordOperation`: Operation selection
- `recordMachineTime`: Machine time input
- `recordExtraTime`: Extra time input
- `recordQuantity`: Quantity input
- `totalTimeDisplay`: Calculated total (read-only)

**Usage Example**:
```javascript
// Open for new entry
openAddRecordDialog('2025-10-18');

// Open for editing existing entry
editingEntryIndex = 2;
openAddRecordDialog('2025-10-18', true);
```

### Reports Dialog (`#reportsDialog`)

**Purpose**: Report generation and display interface

**Report Types**:
1. **Efficiency Report**: Work efficiency coefficient
2. **Parts Report**: Production statistics by part
3. **Machines Report**: Machine utilization analysis
4. **Productivity Report**: Daily productivity metrics
5. **Overtime Report**: Overtime and weekend work
6. **Quality Report**: Operation efficiency analysis

**JavaScript Interface**:
```javascript
function openReportsDialog() {
  const reportsDialog = document.getElementById('reportsDialog');
  const reportMonth = document.getElementById('reportMonth');
  const reportType = document.getElementById('reportType');
  
  // Set current month as default
  const now = new Date();
  const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  reportMonth.value = currentMonth;
  reportType.value = 'efficiency';
  
  // Generate initial report
  generateReport(currentMonth, 'efficiency');
  
  reportsDialog.showModal();
}
```

**Usage Example**:
```javascript
// Open reports dialog
openReportsDialog();

// Generate specific report
generateReport('2025-10', 'parts');

// Change report type
document.getElementById('reportType').value = 'machines';
document.getElementById('reportType').dispatchEvent(new Event('change'));
```

## Form Components

### Machine Management Component

**Purpose**: CRUD operations for machine list

**HTML Structure**:
```html
<div class="row">
  <input id="newMachine" type="text" placeholder="Название станка">
  <button class="primary" id="addMachine" type="button">Добавить</button>
</div>
<ul id="machinesList" class="list">
  <!-- Dynamic machine items -->
</ul>
```

**JavaScript Interface**:
```javascript
function renderMachines() {
  machinesList.innerHTML = '';
  state.machines = state.machines.slice().sort((a,b)=>a.localeCompare(b,'ru'));
  
  state.machines.forEach((name, idx) => {
    const li = document.createElement('li');
    const input = document.createElement('input');
    input.value = name;
    input.addEventListener('input', () => { 
      state.machines[idx] = input.value; 
      saveState(); 
    });
    
    const deleteBtn = document.createElement('button');
    deleteBtn.addEventListener('click', () => { 
      state.machines.splice(idx,1); 
      saveState(); 
      renderMachines(); 
    });
    
    li.appendChild(input);
    li.appendChild(deleteBtn);
    machinesList.appendChild(li);
  });
}
```

**Features**:
- Inline editing
- Alphabetical sorting
- Real-time save
- Delete confirmation

### Parts Management Component

**Purpose**: CRUD operations for parts and their operations

**HTML Structure**:
```html
<div class="row">
  <input id="newPart" type="text" placeholder="Название детали">
  <button class="primary" id="addPart" type="button">Добавить</button>
</div>
<div id="partsContainer" class="parts">
  <!-- Dynamic part items -->
</div>
```

**JavaScript Interface**:
```javascript
function renderParts() {
  partsContainer.innerHTML = '';
  state.parts = state.parts.slice().sort((a,b)=> (a.name||'').localeCompare(b.name||'', 'ru'));
  
  state.parts.forEach((part, pIndex) => {
    const item = document.createElement('div');
    item.className = 'part-simple';
    
    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = part.name;
    
    const editBtn = document.createElement('button');
    editBtn.addEventListener('click', () => { openOperationsDialog(pIndex); });
    
    const delBtn = document.createElement('button');
    delBtn.addEventListener('click', () => { 
      state.parts.splice(pIndex,1); 
      saveState(); 
      renderParts(); 
    });
    
    item.appendChild(name);
    item.appendChild(editBtn);
    item.appendChild(delBtn);
    partsContainer.appendChild(item);
  });
}
```

### Operations Management Component

**Purpose**: Manage operations for a specific part

**Features**:
- Part name editing
- Operation CRUD
- Time calculation
- Grid layout for operation parameters

**JavaScript Interface**:
```javascript
function openOperationsDialog(partIndex) {
  currentPartIndex = partIndex;
  const part = state.parts[partIndex];
  document.getElementById('operationsTitle').textContent = `Редактирование: ${part.name}`;
  operationsDialog.showModal();
  renderOperations();
}

function renderOperations() {
  if (currentPartIndex === -1) return;
  operationsContainer.innerHTML = '';
  const part = state.parts[currentPartIndex];
  
  // Render part name editor
  // Render operations grid
  // Add operation controls
}
```

## Calendar Component

### Calendar Grid (`#calendar`)

**Purpose**: Visual shift schedule with navigation and data indicators

**HTML Structure**:
```html
<div class="calendar-nav">
  <button id="prevMonth">◀</button>
  <div id="monthLabel">October 2025</div>
  <button id="nextMonth">▶</button>
</div>
<div class="calendar" id="calendar">
  <!-- 7 header cells for weekdays -->
  <!-- Variable date cells based on month -->
</div>
```

**JavaScript Interface**:
```javascript
function renderCalendar() {
  if (!calendar || !monthLabel) return;
  monthLabel.textContent = formatMonth(current);
  calendar.innerHTML = '';
  
  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7; // Monday=0
  const daysInMonth = new Date(year, month+1, 0).getDate();

  // Render weekday headers
  const weekDays = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  weekDays.forEach(w => {
    const h = document.createElement('div');
    h.className = 'cell header';
    h.textContent = w;
    calendar.appendChild(h);
  });

  // Render empty cells for month start
  for (let i=0; i<startWeekday; i++) {
    const empty = document.createElement('div');
    empty.className = 'cell empty';
    calendar.appendChild(empty);
  }

  // Render date cells
  for (let day=1; day<=daysInMonth; day++) {
    const date = new Date(year, month, day);
    const type = getShiftType(date);
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.classList.add(type==='D' ? 'day' : type==='N' ? 'night' : 'off');
    
    // Add today indicator
    const today = new Date();
    if (today.getFullYear()===year && today.getMonth()===month && today.getDate()===day) {
      cell.classList.add('today');
    }
    
    // Create date display
    const d = document.createElement('div');
    d.className = 'date';
    d.textContent = String(day);
    
    // Add shift marker
    const mark = document.createElement('sup');
    if (type === 'D') { 
      mark.textContent = 'Д'; 
      mark.className = 'shift-mark day'; 
    } else if (type === 'N') { 
      mark.textContent = 'Н'; 
      mark.className = 'shift-mark night'; 
    }
    d.appendChild(mark);
    cell.appendChild(d);
    
    // Add holiday indicator
    if (isHoliday(date)) {
      const corner = document.createElement('div');
      corner.className = 'holiday-corner';
      cell.appendChild(corner);
    }
    
    // Add data status indicator
    const currentDate = new Date();
    const isPastDate = date < currentDate;
    const isWorkDay = type === 'D' || type === 'N';
    
    if (isPastDate && isWorkDay) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasData = state.records.some(record => record.date === dateString && record.entries.length > 0);
      
      const statusIndicator = document.createElement('div');
      statusIndicator.className = `status-indicator ${hasData ? 'has-data' : 'no-data'}`;
      statusIndicator.innerHTML = hasData ? '✓' : '✗';
      cell.appendChild(statusIndicator);
    }
    
    // Add click handler
    cell.addEventListener('click', () => {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      selectedDate = dateString;
      
      // Show add record button
      const addRecordBtn = document.getElementById('addRecordFromCalendar');
      if (addRecordBtn) {
        addRecordBtn.style.display = 'inline-block';
        addRecordBtn.textContent = `Добавить запись на ${formatDate(dateString)}`;
      }
      
      // Show results if available
      showResults(dateString);
    });
    
    cell.style.cursor = 'pointer';
    calendar.appendChild(cell);
  }
}
```

**CSS Classes**:
- `.cell` - Base cell styling
- `.cell.day` - Day shift (yellow)
- `.cell.night` - Night shift (blue)
- `.cell.off` - Day off (green)
- `.cell.today` - Current date highlight
- `.cell.header` - Weekday headers
- `.status-indicator` - Data presence indicator
- `.holiday-corner` - Holiday marker

**Features**:
- Month navigation
- Shift type visualization
- Holiday indicators
- Data status indicators
- Click interaction
- Responsive grid layout

## Display Components

### Results Display Component

**Purpose**: Show production results in structured format

**HTML Structure**:
```html
<div id="resultsSection" style="display: none;">
  <h3 id="resultsTitle">Результаты работы</h3>
  <div id="resultsContainer">
    <!-- Machine cards with operations -->
  </div>
</div>
```

**JavaScript Interface**:
```javascript
function showResults(date) {
  const resultsSection = document.getElementById('resultsSection');
  const resultsTitle = document.getElementById('resultsTitle');
  const resultsContainer = document.getElementById('resultsContainer');
  
  const record = state.records.find(r => r.date === date);
  if (!record) {
    resultsSection.style.display = 'none';
    return;
  }
  
  const shiftTypeText = record.shiftType === 'D' ? 'Дневная смена' : 
                       record.shiftType === 'N' ? 'Ночная смена' : 
                       record.shiftType === 'O' ? 'Выходной день' : 'Неизвестно';
  
  resultsTitle.textContent = `Результаты работы - ${formatDate(date)}, ${shiftTypeText}`;
  resultsContainer.innerHTML = '';
  
  // Group entries by machine
  const machineGroups = {};
  record.entries.forEach(entry => {
    if (!machineGroups[entry.machine]) {
      machineGroups[entry.machine] = [];
    }
    machineGroups[entry.machine].push(entry);
  });
  
  // Create machine cards
  const sortedMachines = Object.keys(machineGroups).sort((a, b) => a.localeCompare(b, 'ru'));
  sortedMachines.forEach(machine => {
    const machineCard = createMachineCard(machine, machineGroups[machine], date);
    resultsContainer.appendChild(machineCard);
  });
  
  // Add summary card
  const summaryCard = createSummaryCard(record);
  resultsContainer.appendChild(summaryCard);
  
  resultsSection.style.display = 'block';
}
```

**Card Structure**:
```javascript
function createMachineCard(machine, entries, date) {
  const machineCard = document.createElement('div');
  machineCard.className = 'machine-card';
  
  // Machine header
  const machineHeader = document.createElement('div');
  machineHeader.className = 'machine-header';
  machineHeader.textContent = machine.toUpperCase();
  machineCard.appendChild(machineHeader);
  
  // Operations container
  const operationsContainer = document.createElement('div');
  operationsContainer.className = 'operations-container';
  
  entries.forEach((entry, localIndex) => {
    const operationCard = createOperationCard(entry, date, localIndex);
    operationsContainer.appendChild(operationCard);
  });
  
  machineCard.appendChild(operationsContainer);
  return machineCard;
}
```

### Report Display Component

**Purpose**: Render various report types with consistent formatting

**Features**:
- Multiple report types
- Responsive tables
- Color-coded metrics
- Export capabilities

**JavaScript Interface**:
```javascript
function generateReport(monthString, reportType = 'efficiency') {
  const reportContent = document.getElementById('reportContent');
  if (!reportContent) return;
  
  const [year, month] = monthString.split('-').map(Number);
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  // Find records for the month
  const monthRecords = state.records.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate >= startDate && recordDate <= endDate;
  });
  
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  
  let reportHTML = '';
  
  switch (reportType) {
    case 'efficiency':
      reportHTML = generateEfficiencyReport(monthRecords, year, month, monthNames);
      break;
    case 'parts':
      reportHTML = generatePartsReport(monthRecords, year, month, monthNames);
      break;
    case 'machines':
      reportHTML = generateMachinesReport(monthRecords, year, month, monthNames);
      break;
    case 'productivity':
      reportHTML = generateProductivityReport(monthRecords, year, month, monthNames);
      break;
    case 'overtime':
      reportHTML = generateOvertimeReport(monthRecords, year, month, monthNames);
      break;
    case 'quality':
      reportHTML = generateQualityReport(monthRecords, year, month, monthNames);
      break;
    default:
      reportHTML = generateEfficiencyReport(monthRecords, year, month, monthNames);
  }
  
  reportContent.innerHTML = reportHTML;
}
```

## Navigation Components

### Tab Navigation

**Purpose**: Switch between settings panels

**HTML Structure**:
```html
<nav class="tabs" role="tablist" aria-label="Настройки вкладки">
  <button class="tab active" type="button" role="tab" aria-selected="true" data-tab="main">Основное</button>
  <button class="tab" type="button" role="tab" aria-selected="false" data-tab="machines">Станки</button>
  <button class="tab" type="button" role="tab" aria-selected="false" data-tab="parts">Детали</button>
  <button class="tab" type="button" role="tab" aria-selected="false" data-tab="export">📊</button>
</nav>
```

**JavaScript Interface**:
```javascript
tabs.forEach(tab => tab.addEventListener('click', () => selectTab(tab.dataset.tab)));

function selectTab(key) {
  tabs.forEach(t => { 
    t.classList.toggle('active', t.dataset.tab === key); 
    t.setAttribute('aria-selected', String(t.dataset.tab === key)); 
  });
  panels.forEach(p => p.classList.toggle('hidden', p.dataset.panel !== key));
}
```

### Month Navigation

**Purpose**: Navigate calendar months

**JavaScript Interface**:
```javascript
prevMonth?.addEventListener('click', () => { 
  current.setMonth(current.getMonth()-1); 
  renderCalendar(); 
});

nextMonth?.addEventListener('click', () => { 
  current.setMonth(current.getMonth()+1); 
  renderCalendar(); 
});

function formatMonth(date) {
  return date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
}
```

## Styling System

### CSS Custom Properties

```css
:root {
  --bg: #0a0a0a;
  --card: #1a1a1a;
  --card-elevated: #2a2a2a;
  --muted: #6b7280;
  --text: #f8fafc;
  --primary: #6366f1;
  --primary-600: #4f46e5;
  --secondary: #8b5cf6;
  --ring: #6366f1;
  --gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  --gradient-card: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  --shadow-soft: 0 4px 20px rgba(0,0,0,0.3);
  --shadow-elevated: 0 8px 32px rgba(0,0,0,0.4);
  --border-radius: 16px;
  --border-radius-sm: 12px;
}
```

### Component Classes

#### Dialog Styling
```css
.settings-dialog {
  border: 0;
  border-radius: var(--border-radius);
  padding: 0;
  background: var(--gradient-card);
  color: var(--text);
  box-shadow: var(--shadow-elevated);
  border: 1px solid rgba(255,255,255,0.1);
}

.settings-dialog::backdrop {
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(8px);
}
```

#### Button Styling
```css
button.primary, button.secondary {
  background: linear-gradient(145deg, #4f46e5, #3730a3);
  color: white;
  box-shadow:
    8px 8px 16px rgba(0, 0, 0, 0.3),
    -8px -8px 16px rgba(255, 255, 255, 0.1),
    inset 2px 2px 4px rgba(255, 255, 255, 0.2),
    inset -2px -2px 4px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(79, 70, 229, 0.3);
  border-radius: 16px;
}
```

#### Calendar Styling
```css
.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  padding: 8px;
  background: #0f172a;
  border-radius: 8px;
}

.calendar .cell {
  aspect-ratio: 1;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1e293b;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cell.day { background: #FDE68A; color: #0b1220; }
.cell.night { background: #1e3a8a; color: #e5e7eb; }
.cell.off { background: #166534; color: #e5e7eb; }
```

### Responsive Design

#### Mobile Optimization
```css
@media (max-width: 768px) {
  .machine-header {
    font-size: 16px;
    padding: 12px 16px;
  }
  
  .operations-container {
    padding: 16px;
  }
  
  .operation-card {
    padding: 12px;
    margin-bottom: 12px;
  }
}
```

#### Small Screens
```css
@media (max-width: 480px) {
  .app-header {
    padding: 8px;
  }
  
  .button-grid {
    gap: 8px;
    width: 95vw;
    max-width: 350px;
  }
  
  .calendar .cell {
    min-height: 56px;
  }
}
```

## Component Lifecycle

### Initialization Flow

1. **DOM Ready**: Event listener triggers initialization
2. **State Loading**: Load saved state from localStorage
3. **UI Hydration**: Populate form fields with saved data
4. **Event Binding**: Attach event listeners to interactive elements
5. **Component Rendering**: Render dynamic lists and calendar

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // 1. Load state
  state = loadState();
  
  // 2. Initialize UI
  hydrateMain();
  bindMain();
  
  // 3. Render components
  renderMachines();
  renderParts();
  
  // 4. Setup service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
  }
});
```

### Update Cycle

1. **User Interaction**: User modifies data through UI
2. **State Update**: Application state is updated
3. **Persistence**: State is saved to localStorage
4. **UI Refresh**: Affected components are re-rendered

```javascript
// Example: Adding a machine
addMachine.addEventListener('click', () => {
  const name = newMachine.value.trim();
  if (!name) return;
  
  // 1. Update state
  state.machines.push(name);
  
  // 2. Persist state
  saveState();
  
  // 3. Update UI
  newMachine.value = '';
  renderMachines();
});
```

### Component Communication

Components communicate through:
- **Shared State**: Global `state` object
- **Event System**: DOM events and custom events
- **Function Calls**: Direct function invocation
- **DOM Updates**: Reactive UI updates

```javascript
// Example: Calendar to Results communication
cell.addEventListener('click', () => {
  const dateString = formatDateString(date);
  selectedDate = dateString;
  
  // Update add record button
  updateAddRecordButton(dateString);
  
  // Show results for selected date
  showResults(dateString);
});
```

This comprehensive component guide provides detailed information about all UI components, their structure, functionality, and usage patterns in the Смена+ PWA application.