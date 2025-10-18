# Смена+ PWA - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Application Overview](#application-overview)
3. [Settings Configuration](#settings-configuration)
4. [Managing Machines](#managing-machines)
5. [Managing Parts and Operations](#managing-parts-and-operations)
6. [Recording Production Data](#recording-production-data)
7. [Using the Calendar](#using-the-calendar)
8. [Generating Reports](#generating-reports)
9. [Data Management](#data-management)
10. [Troubleshooting](#troubleshooting)

## Getting Started

### System Requirements
- Modern web browser (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- JavaScript enabled
- Local storage support
- Internet connection for initial load (offline capable after first visit)

### First Launch
1. Open the application in your web browser
2. The app will automatically install as a PWA if supported
3. Click the settings button (⚙️) in the top-right corner
4. Configure your basic settings in the "Основное" (Main) tab

### PWA Installation
On supported devices, you can install the app:
- **Android Chrome**: Tap "Add to Home Screen" in the browser menu
- **iOS Safari**: Tap the share button and select "Add to Home Screen"
- **Desktop**: Look for the install prompt or use the browser's install option

## Application Overview

### Main Interface
The application consists of three main action buttons:

1. **Ввод данных** (Data Entry): Opens the calendar for shift management and data entry
2. **Отчеты** (Reports): Opens the reporting interface
3. **Действие 3** (Action 3): Reserved for future functionality

### Navigation Structure
- **Header**: App title and settings button
- **Main Area**: Primary action buttons
- **Dialogs**: Modal windows for detailed operations
- **Version Info**: Current version displayed in bottom-right corner

## Settings Configuration

### Accessing Settings
Click the settings icon (⚙️) in the top-right corner of the main screen.

### Main Settings Tab

#### Operator Information
- **Фамилия и инициалы оператора** (Operator Name): Enter your full name
- **№ смены (1-4)** (Shift Number): Select your shift number (1-4)
- **Базовое время (мин)** (Base Time): Set expected work time per shift in minutes (default: 600)

**Example Configuration**:
```
Operator Name: Иванов И.И.
Shift Number: 2
Base Time: 600 minutes (10 hours)
```

#### Understanding Shift Numbers
The application uses a 16-day rotating schedule:
- **Shift 1**: Starts with night shifts
- **Shift 2**: Starts with day shifts  
- **Shift 3**: Offset schedule
- **Shift 4**: Offset schedule

### Saving Settings
Settings are automatically saved when you modify them. Click "Сохранить" (Save) to close the dialog.

## Managing Machines

### Accessing Machine Management
1. Open Settings (⚙️)
2. Click the "Станки" (Machines) tab

### Adding Machines
1. Enter machine name in the text field
2. Click "Добавить" (Add) button
3. Machine will appear in the sorted list below

### Editing Machines
1. Click on any machine name in the list
2. Edit the name directly
3. Changes are saved automatically

### Deleting Machines
1. Click the delete button (🗑️) next to the machine name
2. Confirm deletion when prompted

**Best Practices**:
- Use consistent naming conventions (e.g., "CNC-001", "Lathe-A")
- Include location or department if helpful
- Avoid special characters that might cause issues

## Managing Parts and Operations

### Accessing Parts Management
1. Open Settings (⚙️)
2. Click the "Детали" (Parts) tab

### Adding Parts
1. Enter part name in the text field
2. Click "Добавить" (Add) button
3. Part will appear in the sorted list

### Editing Parts and Operations
1. Click the edit button (✏️) next to the part name
2. The operations dialog will open
3. Edit the part name at the top if needed
4. Manage operations using the grid below

### Operations Management

#### Adding Operations
1. In the operations dialog, scroll to the bottom
2. Click "Добавить операцию" (Add Operation)
3. Fill in the operation details:
   - **Операция** (Operation): Description of the work
   - **Машинное время (мин)** (Machine Time): Time for machine operation
   - **Доп. время (мин)** (Extra Time): Setup, cleanup, or additional time
   - **Итого (мин)** (Total): Automatically calculated sum

#### Operation Examples
```
Operation: Rough Machining
Machine Time: 15.5 minutes
Extra Time: 3.0 minutes
Total: 18.5 minutes

Operation: Finish Machining  
Machine Time: 8.2 minutes
Extra Time: 1.5 minutes
Total: 9.7 minutes
```

#### Editing Operations
1. Click in any field to edit
2. Changes save automatically
3. Total time updates in real-time

#### Deleting Operations
1. Click the delete button (🗑️) at the end of the operation row
2. Operation is removed immediately

### Deleting Parts
1. Click the delete button (🗑️) next to the part name
2. Confirm deletion - this will remove all associated operations

## Recording Production Data

### Opening Data Entry
1. Click "Ввод данных" (Data Entry) on the main screen
2. The calendar dialog will open
3. Click on any date to select it
4. Click "Добавить запись на [date]" (Add Record for [date])

### Understanding the Entry Form

#### Date and Shift Information
- **Date**: Selected date (can be changed)
- **Shift Type**: Automatically calculated based on your shift number
  - **Дневная смена** (Day Shift)
  - **Ночная смена** (Night Shift)  
  - **Выходной день** (Day Off)

#### Production Details
1. **Станок** (Machine): Select from your configured machines
2. **Деталь** (Part): Select from your configured parts
3. **Операция** (Operation): Select from operations for the chosen part
4. **Машинное время (мин)** (Machine Time): Auto-filled from operation, can be modified
5. **Дополнительное время (мин)** (Extra Time): Auto-filled from operation, can be modified
6. **Количество деталей** (Quantity): Number of parts produced
7. **Общее время** (Total Time): Automatically calculated

### Data Entry Process
1. Select the date you want to record data for
2. Choose the machine you worked on
3. Select the part you produced
4. Choose the specific operation
5. Verify or adjust the time values
6. Enter the quantity of parts produced
7. Review the calculated total time
8. Click "СОХРАНИТЬ" (SAVE)

### Working on Days Off
If you select a day off (выходной), the system will ask:
- **"Это подработка?"** (Is this overtime?)
- Click **"Да"** (Yes) to confirm overtime work
- Click **"Нет"** (No) to cancel

### Multiple Entries per Day
You can add multiple entries for the same day:
1. After saving one entry, the form remains open
2. Fill in another operation
3. Save again
4. Repeat as needed

### Editing Existing Entries
1. Navigate to the date in the calendar
2. Click on the date to view existing entries
3. Click the edit button (✏️) on any entry
4. Modify the values and save

### Deleting Entries
1. Navigate to the date in the calendar
2. Click on the date to view existing entries  
3. Click the delete button (🗑️) on any entry
4. Confirm deletion when prompted

## Using the Calendar

### Calendar Navigation
- **◀ ▶**: Navigate between months
- **Month/Year**: Displayed at the top center

### Understanding Calendar Colors
- **Yellow cells**: Day shifts (Д)
- **Blue cells**: Night shifts (Н)  
- **Green cells**: Days off (О)
- **Orange border**: Current date
- **Red corner**: Federal holidays

### Data Status Indicators
For past work days, small indicators show:
- **Green ✓**: Data has been entered
- **Red ✗**: No data entered yet

### Calendar Interaction
1. Click any date to select it
2. "Add Record" button appears for selected date
3. If data exists, it will be displayed below the calendar
4. Click the add button to enter new data

### Holiday System
The calendar includes Russian federal holidays:
- Automatically calculated for each year
- Shown with red corner markers
- Based on official holiday calendar

## Generating Reports

### Accessing Reports
1. Click "Отчеты" (Reports) on the main screen
2. The reports dialog will open

### Report Configuration
1. **Month Selection**: Choose the month for analysis
2. **Report Type**: Select from available report types
3. Reports generate automatically when selections change

### Report Types

#### 1. Коэффициент выработки (Efficiency Report)
**Purpose**: Measures work efficiency against expected time

**Metrics**:
- Days worked vs total shifts in month
- Total work time vs expected time  
- Efficiency coefficient (actual/expected)

**Interpretation**:
- Coefficient ≥ 1.0: Meeting or exceeding expectations (green)
- Coefficient < 1.0: Below expectations (red)

#### 2. Произведенные детали (Parts Report)
**Purpose**: Analyzes production by part type

**Information**:
- Parts produced with quantities
- Operations performed
- Time spent per part type
- Machines used

**Use Cases**:
- Track production variety
- Identify most/least produced parts
- Analyze operation efficiency

#### 3. Загрузка станков (Machine Utilization Report)
**Purpose**: Shows machine usage statistics

**Metrics**:
- Total time per machine
- Number of work days per machine
- Parts produced per machine
- Variety of parts per machine

**Use Cases**:
- Balance machine workload
- Identify underutilized equipment
- Plan maintenance schedules

#### 4. Производительность по дням (Daily Productivity Report)
**Purpose**: Day-by-day productivity analysis

**Information**:
- Daily work time
- Parts produced per day
- Number of operations per day
- Shift type for each day

**Use Cases**:
- Identify productive vs unproductive days
- Analyze patterns over time
- Compare day vs night shift performance

#### 5. Подработки и выходные (Overtime Report)
**Purpose**: Tracks overtime and weekend work

**Metrics**:
- Number of overtime days
- Overtime hours vs regular hours
- List of specific overtime dates
- Parts produced during overtime

**Use Cases**:
- Calculate overtime compensation
- Monitor work-life balance
- Track extra production capacity

#### 6. Анализ качества работы (Quality Analysis Report)
**Purpose**: Analyzes operation efficiency and quality

**Metrics**:
- Average time per operation type
- Efficiency rating per operation
- Total operations performed
- Quality indicators

**Use Cases**:
- Identify operations needing improvement
- Compare actual vs standard times
- Focus training efforts

### Reading Reports
- All reports use consistent formatting
- Color coding indicates performance levels
- Data is grouped logically for easy analysis
- Time values are always in minutes

### Report Best Practices
- Generate reports monthly for trend analysis
- Compare current month to previous months
- Use multiple report types for comprehensive analysis
- Share reports with supervisors for performance reviews

## Data Management

### Exporting Data
1. Open Settings (⚙️)
2. Click the "📊" (Export/Import) tab
3. Click "📥 Скачать данные" (Download Data)
4. A JSON file will be downloaded with format: `pwa-backup-YYYY-MM-DD.json`

**Export includes**:
- All settings (operator name, shift, base time)
- Complete machine list
- All parts with operations
- All production records

### Importing Data
1. Open Settings (⚙️)
2. Click the "📊" (Export/Import) tab
3. Click "📤 Выбрать файл" (Select File)
4. Choose your backup JSON file
5. Click "Импортировать" (Import)
6. Wait for confirmation message

**Import process**:
- Validates file format
- Replaces all current data
- Updates UI automatically
- Shows success/error status

### Data Backup Strategy
**Recommended practices**:
- Export data weekly or monthly
- Store backups in multiple locations
- Test imports periodically
- Keep backups when updating the app

### Data Storage
- All data stored locally in browser
- No data sent to external servers
- Data persists between browser sessions
- Clearing browser data will delete all information

## Troubleshooting

### Common Issues

#### App Won't Load
**Symptoms**: Blank screen or loading errors
**Solutions**:
1. Check internet connection for first load
2. Clear browser cache and reload
3. Disable browser extensions temporarily
4. Try incognito/private browsing mode

#### Data Not Saving
**Symptoms**: Changes disappear after refresh
**Solutions**:
1. Check if browser storage is full
2. Ensure JavaScript is enabled
3. Check browser privacy settings
4. Try different browser

#### Calendar Shows Wrong Shifts
**Symptoms**: Shift types don't match expected schedule
**Solutions**:
1. Verify shift number in settings
2. Check if anchor date is correct
3. Confirm current date on device
4. Recalculate from known reference date

#### Reports Show No Data
**Symptoms**: Empty reports despite entered data
**Solutions**:
1. Verify date range selection
2. Check if data exists for selected month
3. Ensure records have entries (not just empty records)
4. Try different report type

#### Import Fails
**Symptoms**: Error messages during data import
**Solutions**:
1. Verify file is valid JSON format
2. Check file wasn't corrupted during transfer
3. Ensure file was exported from same app version
4. Try importing smaller data sets

### Performance Issues

#### Slow Calendar Navigation
**Causes**: Large amounts of data, older devices
**Solutions**:
1. Archive old data periodically
2. Close other browser tabs
3. Restart browser
4. Clear browser cache

#### Slow Report Generation
**Causes**: Large datasets, complex calculations
**Solutions**:
1. Generate reports for shorter time periods
2. Close other applications
3. Use desktop browser instead of mobile
4. Wait for processing to complete

### Data Recovery

#### Lost Data
If data is accidentally deleted:
1. Check recent backups
2. Look for browser backup/sync features
3. Check if data exists in other browser profiles
4. Restore from most recent export file

#### Corrupted Data
If app behaves strangely:
1. Export current data if possible
2. Clear browser storage
3. Restart app
4. Import backup data
5. Re-enter recent changes manually

### Browser Compatibility

#### Supported Features by Browser
- **Chrome/Edge**: Full feature support
- **Firefox**: Full feature support  
- **Safari**: Full support on iOS 13+
- **Mobile browsers**: Optimized responsive design

#### PWA Features
- **Offline access**: After first load
- **Install to home screen**: Most modern browsers
- **Background sync**: Chrome/Edge only
- **Push notifications**: Not implemented

### Getting Help

#### Self-Help Resources
1. Review this user guide
2. Check the API documentation for technical details
3. Verify browser console for error messages
4. Test with sample data

#### Reporting Issues
When reporting problems, include:
- Browser type and version
- Device type (desktop/mobile)
- Steps to reproduce the issue
- Error messages if any
- Sample data if relevant

### Best Practices Summary

#### Daily Use
- Enter data promptly after work
- Review calendar indicators regularly
- Check for missed entries
- Backup data weekly

#### Monthly Routine
- Generate efficiency reports
- Export data backup
- Review machine utilization
- Plan improvements based on reports

#### System Maintenance
- Update browser regularly
- Clear cache monthly
- Test data import/export
- Monitor storage usage

This user guide provides comprehensive instructions for using all features of the Смена+ PWA application effectively.