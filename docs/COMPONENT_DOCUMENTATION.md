# PWA Shift Manager - Component Documentation

## Table of Contents

1. [HTML Components](#html-components)
2. [Dialog Components](#dialog-components)
3. [Form Components](#form-components)
4. [Calendar Component](#calendar-component)
5. [Report Components](#report-components)
6. [CSS Architecture](#css-architecture)
7. [Event Handlers](#event-handlers)
8. [Component Examples](#component-examples)

## HTML Components

### App Header

The main application header with title and settings button.

```html
<header class="app-header">
  <h1 class="app-title">Смена+</h1>
  <button class="icon-button" id="settingsButton" aria-label="Открыть настройки" title="Настройки">
    <svg><!-- Settings icon --></svg>
  </button>
</header>
```

**Properties:**
- `app-header`: Sticky header with gradient background
- `app-title`: Gradient text effect using CSS
- `icon-button`: Reusable icon button style

**CSS Classes:**
```css
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--gradient-card);
  backdrop-filter: blur(20px);
}
```

### Main Navigation

Three primary action buttons on the home screen.

```html
<div class="button-grid">
  <button class="primary" id="actionOne">
    <svg class="button-icon"><!-- Icon --></svg>
    Ввод данных
  </button>
  <button class="secondary" id="actionTwo">
    <svg class="button-icon"><!-- Icon --></svg>
    Отчеты
  </button>
  <button class="secondary" id="actionThree">Действие 3</button>
</div>
```

**Button Types:**
- `primary`: Primary action button with gradient
- `secondary`: Secondary action button
- `icon-only`: Icon-only buttons (used in lists)

## Dialog Components

### Base Dialog Structure

All dialogs follow this pattern:

```html
<dialog id="dialogId" class="settings-dialog" aria-labelledby="dialogTitle">
  <form method="dialog" class="settings-content">
    <header class="settings-header">
      <h2 id="dialogTitle">Dialog Title</h2>
      <button class="icon-button" id="closeButton" value="cancel">
        <svg><!-- Close icon --></svg>
      </button>
    </header>
    <section class="settings-body">
      <!-- Content -->
    </section>
    <footer class="settings-footer">
      <button class="secondary" value="cancel">Cancel</button>
      <button class="primary" value="default">Save</button>
    </footer>
  </form>
</dialog>
```

### Settings Dialog

Multi-tab settings interface.

```html
<nav class="tabs" role="tablist">
  <button class="tab active" role="tab" data-tab="main">Основное</button>
  <button class="tab" role="tab" data-tab="machines">Станки</button>
  <button class="tab" role="tab" data-tab="parts">Детали</button>
  <button class="tab" role="tab" data-tab="export">
    <svg><!-- Export icon --></svg>
  </button>
</nav>

<div class="tab-panel" data-panel="main">
  <!-- Tab content -->
</div>
```

**Tab Management:**
```javascript
function selectTab(key) {
  tabs.forEach(t => {
    t.classList.toggle('active', t.dataset.tab === key);
    t.setAttribute('aria-selected', String(t.dataset.tab === key));
  });
  panels.forEach(p => p.classList.toggle('hidden', p.dataset.panel !== key));
}
```

### Data Entry Dialog

Calendar-based data entry interface.

```html
<dialog id="dataDialog" class="settings-dialog">
  <div class="calendar-nav">
    <button class="secondary" id="prevMonth">◀</button>
    <div id="monthLabel">Октябрь 2025</div>
    <button class="secondary" id="nextMonth">▶</button>
  </div>
  <div class="calendar" id="calendar">
    <!-- Calendar cells -->
  </div>
</dialog>
```

## Form Components

### Input Fields

Standard form field structure:

```html
<div class="field">
  <label for="fieldId">Field Label</label>
  <input id="fieldId" type="text" placeholder="Placeholder text">
</div>
```

**Field Types:**

1. **Text Input:**
```html
<input type="text" placeholder="Enter text">
```

2. **Number Input:**
```html
<input type="number" min="0" step="1" placeholder="0">
```

3. **Select Dropdown:**
```html
<select id="selectId">
  <option value="">Choose option</option>
  <option value="1">Option 1</option>
</select>
```

4. **Date Input:**
```html
<input type="date" id="dateInput">
```

### Dynamic Lists

Machine and parts list management:

```html
<ul id="machinesList" class="list">
  <li>
    <input type="text" value="Machine name">
    <div class="actions">
      <button class="icon-only" title="Delete">
        <svg><!-- Delete icon --></svg>
      </button>
    </div>
  </li>
</ul>
```

**JavaScript Handler:**
```javascript
function renderMachines() {
  machinesList.innerHTML = '';
  state.machines.forEach((name, idx) => {
    const li = document.createElement('li');
    const input = document.createElement('input');
    input.value = name;
    input.addEventListener('input', () => {
      state.machines[idx] = input.value;
      saveState();
    });
    // ... rest of implementation
  });
}
```

## Calendar Component

### Calendar Structure

```html
<div class="calendar" id="calendar">
  <!-- Weekday headers -->
  <div class="cell header">Пн</div>
  <div class="cell header">Вт</div>
  <!-- ... -->
  
  <!-- Date cells -->
  <div class="cell day today">
    <div class="date">15<sup class="shift-mark day">Д</sup></div>
    <div class="holiday-corner"></div>
    <div class="status-indicator has-data">✓</div>
  </div>
</div>
```

**Cell Classes:**
- `cell`: Base calendar cell
- `header`: Weekday header cell
- `empty`: Empty cell (padding)
- `day`: Day shift
- `night`: Night shift
- `off`: Day off
- `today`: Current date
- `holiday-corner`: Holiday indicator

**Status Indicators:**
```css
.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 10px;
}

.status-indicator.has-data {
  background: #22c55e;
  color: white;
}

.status-indicator.no-data {
  background: #ef4444;
  color: white;
}
```

### Calendar Rendering

```javascript
function renderCalendar() {
  calendar.innerHTML = '';
  
  // Add weekday headers
  const weekDays = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  weekDays.forEach(w => {
    const h = document.createElement('div');
    h.className = 'cell header';
    h.textContent = w;
    calendar.appendChild(h);
  });
  
  // Add date cells
  for (let day = 1; day <= daysInMonth; day++) {
    const cell = createDateCell(day, month, year);
    calendar.appendChild(cell);
  }
}
```

## Report Components

### Report Card Structure

```html
<div class="machine-card">
  <div class="machine-header">MACHINE NAME</div>
  <div class="operations-container">
    <div class="operation-card">
      <div class="operation-header">
        <div class="part-name">Part Name</div>
        <div class="part-number">Operation</div>
      </div>
      <div class="operation-data">
        <div class="data-row">
          <span class="data-label">Label:</span>
          <span class="data-value">Value</span>
        </div>
      </div>
      <div class="action-buttons">
        <button class="edit-btn" onclick="editEntry()">✏️</button>
        <button class="delete-btn" onclick="deleteEntry()">🗑️</button>
      </div>
    </div>
  </div>
</div>
```

**Styling Classes:**
```css
.machine-card {
  background: var(--gradient-card);
  border-radius: var(--border-radius);
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: var(--shadow-soft);
}

.machine-header {
  background: var(--gradient-primary);
  color: white;
  padding: 16px 20px;
  font-weight: 700;
  text-transform: uppercase;
}
```

### Dynamic Report Generation

```javascript
function generateReportCard(title, data) {
  return `
    <div class="machine-card">
      <div class="machine-header">${title}</div>
      <div class="operations-container">
        ${data.map(item => `
          <div class="operation-card">
            <div class="operation-data">
              ${Object.entries(item).map(([key, value]) => `
                <div class="data-row">
                  <span class="data-label">${key}:</span>
                  <span class="data-value">${value}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
```

## CSS Architecture

### CSS Variables

```css
:root {
  /* Colors */
  --bg: #0a0a0a;
  --card: #1a1a1a;
  --card-elevated: #2a2a2a;
  --text: #f8fafc;
  --primary: #6366f1;
  --secondary: #8b5cf6;
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  --gradient-card: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  
  /* Shadows */
  --shadow-soft: 0 4px 20px rgba(0,0,0,0.3);
  --shadow-elevated: 0 8px 32px rgba(0,0,0,0.4);
  
  /* Spacing */
  --border-radius: 16px;
  --border-radius-sm: 12px;
}
```

### Responsive Design

```css
/* Mobile-first approach */
.button-grid {
  display: grid;
  gap: 20px;
  width: 66vw;
  max-width: 800px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .settings-dialog {
    max-width: 600px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .app-header {
    padding: 24px 48px;
  }
}
```

### Component States

```css
/* Button states */
button.primary {
  background: var(--gradient-primary);
  transition: all 0.2s ease;
}

button.primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-elevated);
}

button.primary:active {
  transform: translateY(0);
}

button.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## Event Handlers

### Dialog Management

```javascript
// Opening dialogs
function openDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  if (dialog) {
    dialog.showModal();
  }
}

// Closing dialogs
dialog.addEventListener('close', (e) => {
  if (dialog.returnValue === 'cancel') {
    // Handle cancellation
  } else {
    // Handle save
  }
});
```

### Form Validation

```javascript
// Real-time validation
input.addEventListener('input', (e) => {
  const value = e.target.value;
  const isValid = validateInput(value);
  
  e.target.classList.toggle('error', !isValid);
  e.target.setCustomValidity(isValid ? '' : 'Invalid input');
});

// Form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  
  // Process form data
});
```

### Dynamic Updates

```javascript
// Auto-save on input
input.addEventListener('input', debounce(() => {
  state.field = input.value;
  saveState();
}, 500));

// Live calculations
function updateCalculations() {
  const total = calculateTotal();
  totalDisplay.textContent = `${total} мин`;
  coefficientDisplay.textContent = calculateCoefficient(total, baseTime);
}
```

## Component Examples

### Creating a Custom Dialog

```javascript
function createCustomDialog() {
  const dialog = document.createElement('dialog');
  dialog.className = 'settings-dialog';
  dialog.innerHTML = `
    <div class="settings-content">
      <header class="settings-header">
        <h2>Custom Dialog</h2>
        <button class="icon-button" onclick="this.closest('dialog').close()">
          ✕
        </button>
      </header>
      <section class="settings-body">
        <!-- Your content here -->
      </section>
      <footer class="settings-footer">
        <button class="primary" onclick="handleSave()">Save</button>
      </footer>
    </div>
  `;
  
  document.body.appendChild(dialog);
  return dialog;
}
```

### Custom List Component

```javascript
class ListComponent {
  constructor(container, items) {
    this.container = container;
    this.items = items;
  }
  
  render() {
    this.container.innerHTML = '';
    
    this.items.forEach((item, index) => {
      const element = this.createListItem(item, index);
      this.container.appendChild(element);
    });
  }
  
  createListItem(item, index) {
    const li = document.createElement('li');
    li.className = 'list-item';
    li.innerHTML = `
      <span class="item-text">${item.name}</span>
      <div class="item-actions">
        <button onclick="editItem(${index})">Edit</button>
        <button onclick="deleteItem(${index})">Delete</button>
      </div>
    `;
    return li;
  }
}

// Usage
const list = new ListComponent(
  document.getElementById('myList'),
  state.items
);
list.render();
```

### Reusable Form Field

```javascript
function createFormField(config) {
  const field = document.createElement('div');
  field.className = 'field';
  
  const label = document.createElement('label');
  label.textContent = config.label;
  label.htmlFor = config.id;
  
  let input;
  switch (config.type) {
    case 'select':
      input = document.createElement('select');
      config.options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.text;
        input.appendChild(option);
      });
      break;
    case 'number':
      input = document.createElement('input');
      input.type = 'number';
      input.min = config.min || 0;
      input.step = config.step || 1;
      break;
    default:
      input = document.createElement('input');
      input.type = config.type || 'text';
  }
  
  input.id = config.id;
  input.name = config.name || config.id;
  input.placeholder = config.placeholder || '';
  input.required = config.required || false;
  
  if (config.value !== undefined) {
    input.value = config.value;
  }
  
  if (config.onChange) {
    input.addEventListener('change', config.onChange);
  }
  
  field.appendChild(label);
  field.appendChild(input);
  
  return field;
}

// Usage
const nameField = createFormField({
  id: 'userName',
  label: 'Your Name',
  type: 'text',
  placeholder: 'Enter your name',
  required: true,
  onChange: (e) => console.log('Name changed:', e.target.value)
});
```

### Toast Notification Component

```javascript
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  // CSS for toast
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 16px 24px;
    background: var(--card-elevated);
    color: var(--text);
    border-radius: var(--border-radius-sm);
    box-shadow: var(--shadow-elevated);
    transform: translateY(100px);
    transition: transform 0.3s ease;
    z-index: 1000;
  `;
  
  document.body.appendChild(toast);
  
  // Animate in
  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
  });
  
  // Remove after delay
  setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Usage
showToast('Data saved successfully', 'success');
showToast('Error occurred', 'error');
showToast('Processing...', 'info');
```