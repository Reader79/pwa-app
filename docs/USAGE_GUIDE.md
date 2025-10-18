# PWA Shift Manager - Usage Guide

## Table of Contents

1. [Getting Started](#getting-started)
2. [Initial Setup](#initial-setup)
3. [Managing Machines](#managing-machines)
4. [Managing Parts and Operations](#managing-parts-and-operations)
5. [Recording Work Data](#recording-work-data)
6. [Viewing Calendar and Shifts](#viewing-calendar-and-shifts)
7. [Generating Reports](#generating-reports)
8. [Data Backup and Restore](#data-backup-and-restore)
9. [Offline Usage](#offline-usage)
10. [Troubleshooting](#troubleshooting)

## Getting Started

### Installation

1. **As a Web App:**
   - Visit the application URL in your browser
   - The app will automatically cache for offline use
   - You can install it as a PWA by clicking the install prompt

2. **Local Development:**
   ```bash
   # Clone the repository
   git clone [repository-url]
   
   # Install dependencies
   npm install
   
   # Start development server
   npm start
   ```

### First Launch

When you first open the application, you'll see the main screen with three buttons:
- **Ввод данных** (Data Entry) - Access the shift calendar and record work
- **Отчеты** (Reports) - Generate various reports
- **Действие 3** (Action 3) - Placeholder for future features

## Initial Setup

### Step 1: Configure Operator Settings

1. Click the settings button (⚙️) in the top-right corner
2. In the "Основное" (Main) tab, enter:
   - **Фамилия и инициалы оператора** - Your full name (e.g., "Иванов И.И.")
   - **№ смены** - Your shift number (1-4)
   - **Базовое время** - Base time in minutes (e.g., 600)

```javascript
// Example settings:
{
  operatorName: "Иванов И.И.",
  shiftNumber: 1,
  baseTime: 600
}
```

### Step 2: Add Machines

1. Navigate to the "Станки" (Machines) tab
2. Enter machine names one by one
3. Click "Добавить" (Add) for each machine

**Example machines:**
- Токарный станок
- Фрезерный станок
- Сверлильный станок
- Шлифовальный станок

### Step 3: Add Parts and Operations

1. Navigate to the "Детали" (Parts) tab
2. Enter part name and click "Добавить" (Add)
3. Click the edit button (✏️) next to the part
4. Add operations with their time requirements

**Example part configuration:**
```javascript
{
  name: "Вал-шестерня",
  operations: [
    {
      name: "Точение черновое",
      machineTime: 20,  // Machine time in minutes
      extraTime: 5      // Additional time in minutes
    },
    {
      name: "Точение чистовое",
      machineTime: 30,
      extraTime: 10
    }
  ]
}
```

## Managing Machines

### Adding Machines

```javascript
// Via UI:
1. Settings → Станки tab
2. Type machine name
3. Click "Добавить"

// The machine will be added to:
state.machines = ["Machine 1", "Machine 2", ...]
```

### Editing Machines

1. Click on the machine name in the list
2. Edit the text directly
3. Changes save automatically

### Deleting Machines

1. Click the delete button (🗑️) next to the machine
2. Confirm deletion when prompted

⚠️ **Warning:** Deleting a machine doesn't remove existing records that reference it.

## Managing Parts and Operations

### Creating Parts

1. Navigate to Settings → Детали
2. Enter part name
3. Click "Добавить"

### Configuring Operations

1. Click the edit button (✏️) next to a part
2. In the operations dialog:
   - Edit the part name at the top
   - Add operations with:
     - Operation name
     - Machine time (minutes)
     - Extra time (minutes)
   - The total time is calculated automatically

**Best Practices:**
- Use descriptive operation names
- Include setup time in extra time
- Be consistent with time estimates

### Operation Examples

```javascript
// Turning operation
{
  name: "Точение Ø50",
  machineTime: 15,    // Actual cutting time
  extraTime: 5        // Setup, measurement, etc.
}

// Milling operation
{
  name: "Фрезерование паза",
  machineTime: 25,
  extraTime: 10
}

// Drilling operation
{
  name: "Сверление 4 отв. Ø8",
  machineTime: 8,
  extraTime: 4
}
```

## Recording Work Data

### Accessing the Calendar

1. Click "Ввод данных" (Data Entry) on the main screen
2. The calendar shows your shift schedule:
   - **Д** (Day shift) - Green
   - **Н** (Night shift) - Blue
   - **Выходной** (Day off) - Gray
   - Red corner indicates holidays

### Adding Work Records

1. **Select a date** by clicking on it in the calendar
2. Click "Добавить запись на [date]"
3. Fill in the record form:
   - **Станок** - Select the machine used
   - **Деталь** - Select the part produced
   - **Операция** - Select the operation performed
   - **Машинное время** - Actual machine time
   - **Дополнительное время** - Additional time
   - **Количество деталей** - Number of parts produced

4. Click "СОХРАНИТЬ" (Save)

**Example Entry:**
```javascript
{
  machine: "Токарный станок",
  part: "Вал-шестерня",
  operation: "Точение черновое",
  machineTime: 20,
  extraTime: 5,
  quantity: 15,
  totalTime: 375  // (20 + 5) * 15
}
```

### Recording Overtime

When adding records on days off:
1. The system will ask "Это подработка?" (Is this overtime?)
2. Click "Да" (Yes) to confirm overtime work
3. These records are tracked separately in reports

### Editing Records

1. View the day's records by clicking on the date
2. Click the edit button (✏️) next to any entry
3. Modify the values
4. Click "СОХРАНИТЬ" to update

### Deleting Records

1. Click the delete button (🗑️) next to any entry
2. Confirm deletion when prompted

## Viewing Calendar and Shifts

### Understanding Shift Cycles

The application uses a 16-day shift rotation:
- 2 day shifts → 2 days off → 2 day shifts → 2 days off
- 2 night shifts → 2 days off → 2 night shifts → 2 days off

**Shift Numbers:**
- Shift 1: Starts with night shifts
- Shift 2: Starts with day shifts
- Shift 3 & 4: Offset accordingly

### Calendar Features

- **Current day** - Highlighted with a border
- **Holidays** - Red triangle in corner
- **Data status indicators:**
  - ✓ Green - Data recorded
  - ✗ Red - No data (for past work days)

### Navigation

- Use ◀ ▶ buttons to navigate months
- Click any date to view/add records
- Past dates show completion status

## Generating Reports

### Available Report Types

1. **Коэффициент выработки** (Efficiency Coefficient)
   - Shows overall productivity vs. expected output
   - Formula: Total Time / (Shifts × Base Time)

2. **Произведенные детали** (Produced Parts)
   - Lists all parts and operations
   - Shows quantities and total time

3. **Загрузка станков** (Machine Utilization)
   - Machine usage statistics
   - Work days and total production

4. **Производительность по дням** (Daily Productivity)
   - Day-by-day breakdown
   - Shows time and parts produced

5. **Подработки и выходные** (Overtime Report)
   - Tracks work on days off
   - Separates regular and overtime

6. **Анализ качества работы** (Quality Analysis)
   - Average time per operation
   - Efficiency indicators

### Generating a Report

1. Click "Отчеты" (Reports) on the main screen
2. Select the month using the date picker
3. Choose report type from the dropdown
4. The report generates automatically

**Example Report Output:**
```
КОЭФФИЦИЕНТ ВЫРАБОТКИ - ОКТЯБРЬ 2025
- Отработанных дней: 15
- Всего смен в месяце: 20
- Общее время работы: 9000 мин
- Ожидаемое время: 12000 мин
- Коэффициент выработки: 0.750
```

### Interpreting Reports

- **Coefficient > 1.0** - Exceeding expectations (green)
- **Coefficient < 1.0** - Below expectations (red)
- Use reports to identify:
  - Most produced parts
  - Busiest machines
  - Productivity trends

## Data Backup and Restore

### Exporting Data

1. Go to Settings → Export tab (📊)
2. Click "📥 Скачать данные" (Download Data)
3. A JSON file will be downloaded with format:
   `pwa-backup-YYYY-MM-DD.json`

**Export includes:**
- All operator settings
- Machine list
- Parts and operations
- All work records

### Importing Data

1. Go to Settings → Export tab
2. Click "📤 Выбрать файл" (Select File)
3. Choose your backup JSON file
4. Click "Импортировать" (Import)
5. Wait for success message

**Important:**
- Importing replaces ALL current data
- Always export current data before importing
- Only import files from this application

### Backup Best Practices

1. **Regular Backups:**
   - Weekly for active use
   - Before major changes
   - Before app updates

2. **File Storage:**
   - Keep multiple versions
   - Store in cloud storage
   - Name files descriptively

3. **Version Control:**
   ```
   pwa-backup-2025-10-15-before-update.json
   pwa-backup-2025-10-22-weekly.json
   pwa-backup-2025-10-29-monthly.json
   ```

## Offline Usage

### How Offline Works

The application uses Service Workers to cache:
- Application shell (HTML, CSS, JS)
- Icons and assets
- All data is stored locally

### Offline Capabilities

✅ **Available Offline:**
- All data entry functions
- Report generation
- Settings management
- Calendar viewing
- Full CRUD operations

❌ **Requires Internet:**
- Initial app installation
- App updates
- Font loading (falls back to system fonts)

### Sync Behavior

- Data is stored in localStorage
- No server sync required
- All operations are local
- Export/import for data transfer

## Troubleshooting

### Common Issues

**1. App not updating:**
```javascript
// Force update service worker
navigator.serviceWorker.getRegistration().then(reg => {
  reg.update();
});
```

**2. Data not saving:**
- Check browser storage quota
- Clear browser cache
- Export data and reimport

**3. Calendar showing wrong shifts:**
- Verify shift number in settings
- Check system date/time
- Refresh the page

### Storage Management

**Check storage usage:**
```javascript
navigator.storage.estimate().then(estimate => {
  console.log(`Using ${estimate.usage} of ${estimate.quota} bytes`);
});
```

**Clear old data:**
```javascript
// Export important data first!
localStorage.clear();
location.reload();
```

### Debug Mode

Open browser console and run:
```javascript
// View current state
console.log(JSON.parse(localStorage.getItem('pwa-settings-v1')));

// Check shift calculation
const date = new Date('2025-10-15');
console.log('Shift type:', getShiftType(date));

// List all records
state.records.forEach(r => console.log(r.date, r.entries.length));
```

### Browser Compatibility

**Supported Browsers:**
- Chrome/Edge 80+
- Firefox 75+
- Safari 14+
- Opera 67+

**Required Features:**
- Service Workers
- localStorage
- ES6 support
- CSS Grid/Flexbox

### Getting Help

1. **Check browser console** for errors
2. **Export your data** before troubleshooting
3. **Try incognito mode** to rule out extensions
4. **Clear cache and reload** if UI issues persist

## Advanced Usage Tips

### Keyboard Shortcuts

- **Enter** - Confirm input fields
- **Escape** - Close dialogs
- **Tab** - Navigate form fields

### Performance Tips

1. **Regular cleanup:**
   - Delete old records (>6 months)
   - Remove unused parts/machines
   - Keep operation lists concise

2. **Optimal workflow:**
   - Enter data daily
   - Generate reports monthly
   - Export backups weekly

3. **Data organization:**
   - Use consistent naming
   - Group similar operations
   - Archive completed projects

### Customization

While the app doesn't have built-in themes, you can:
1. Use browser zoom for larger text
2. Install as PWA for fullscreen mode
3. Use browser extensions for custom CSS

### Integration Ideas

Export data can be used for:
- Excel analysis
- Custom reporting tools
- Database imports
- API integrations

**Example: Excel Integration**
1. Export JSON data
2. Use Power Query to import
3. Create pivot tables
4. Generate advanced analytics