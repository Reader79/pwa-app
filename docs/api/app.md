# Публичные API — app.js

Ниже перечислены функции и объекты верхнего уровня, которые образуют публичное API приложения (все определены внутри обработчика `DOMContentLoaded`). Большинство функций работают с состоянием `state` и DOM-элементами из `index.html`.

> Примечание: часть функций привязана к `window` для прямого вызова из HTML (`removeEntry`, `editEntry`, `deleteEntry`). Остальные — модульные функции в пределах файла.

## Состояние и хранение
- **STORAGE_KEY**: строка ключа `pwa-settings-v1`.
- **defaultState**: объект начального состояния.
- **state**: текущее состояние в памяти.
- `loadState()` → state: читает состояние из `localStorage` или возвращает клон `defaultState`.
- `saveState()` → void: сохраняет `state` в `localStorage`.

### Примеры
```js
// Прочитать состояние
const current = (function(){ try { return JSON.parse(localStorage.getItem('pwa-settings-v1')); } catch { return null; } })();

// Принудительно сохранить актуальное состояние UI
// (внутренне используется app.js)
```

## Расчеты и утилиты
- `calculateTotalTime(machineTime, extraTime, quantity)` → number: возвращает `(machineTime + extraTime) * quantity`.
- `calculateCoefficient(totalTime, baseTime)` → number: коэффициент с округлением до сотых.
- `formatDate(dateInput)` → string: форматирует дату в `ru-RU`.

### Примеры
```js
const total = calculateTotalTime(10, 2, 5); // 60
const k = calculateCoefficient(600, 600);   // 1
```

## Смены и календарь
- `getShiftType(date: Date)` → 'D' | 'N' | 'O': возвращает тип смены для текущего `shiftNumber`.
- `renderCalendar()` → void: рендер календаря в `#calendar` c индикаторами.
- `openDataEntry()` → void: открывает диалог ввода данных и вызывает `renderCalendar()`.
- `formatMonth(date)` → string: "Месяц Год" на `ru-RU`.
- `isHoliday(date)` → boolean: проверка праздничных дней.

Связанное:
- `selectTab(key)` переключает вкладки настроек.
- `updateShiftType()` обновляет текст `#shiftTypeDisplay` по дате.

### Примеры
```js
// Открыть календарь и отрисовать текущий месяц
openDataEntry();

// Получить тип смены на конкретную дату
const shift = getShiftType(new Date('2025-10-11'));
```

## CRUD: Станки и детали
- `renderMachines()` → void: рендер и двусторонняя привязка списка `machines`.
- `renderParts()` → void: рендер списка `parts`.
- `openOperationsDialog(partIndex)` → void: открыть диалог операций для детали.
- `renderOperations()` → void: рендер строк операций, поддержка добавления/удаления.

UI-элементы добавления создают новые элементы в `state` и вызывают `saveState()`.

## Добавление и редактирование записей смены
- `openAddRecordDialog(date?, isEditMode?)` → void: открыть диалог добавления записи.
- `updateMachineOptions()`/`updatePartOptions()`/`updateOperationOptions()` → void: заполнение select-ов.
- `updateTotalTime()` → void: пересчет `#totalTimeDisplay`.
- `saveRecordEntry()` → void: валидирует поля и записывает в `state.records` (добавление/редактирование), сохраняет, обновляет UI.

Глобально доступные функции для действий в таблице результатов:
- `window.removeEntry(index)` → void: удаляет временную запись из списка диалога.
- `window.editEntry(date, index)` → void: открывает диалог редактирования записи из выбранного дня.
- `window.deleteEntry(date, index)` → void: удаляет запись дня и обновляет UI.

### Примеры
```js
// Программно открыть диалог и создать запись
openAddRecordDialog('2025-10-20');
// Далее пользователь заполняет форму и жмет «СОХРАНИТЬ», что вызовет saveRecordEntry()
```

## Отчеты
- `openReportsDialog()` → void: открывает диалог отчетов и генерирует отчет по умолчанию.
- `generateReport(monthString, reportType)` → void: маршрутизатор типов отчетов.
- Типы отчетов:
  - `generateEfficiencyReport(monthRecords, year, month, monthNames)` → string (HTML)
  - `generatePartsReport(...)` → string (HTML)
  - `generateMachinesReport(...)` → string (HTML)
  - `generateProductivityReport(...)` → string (HTML)
  - `generateOvertimeReport(...)` → string (HTML)
  - `generateQualityReport(...)` → string (HTML)

### Примеры
```js
// Сменить тип отчета
const month = '2025-10';
generateReport(month, 'machines');
```

## Экспорт/Импорт
- `exportAppData()` → void: скачивает JSON-бэкап состояния.
- `importAppData(file: File)` → Promise<string>: читает JSON и подменяет `state`, обновляет UI.
- `showImportStatus(message, type?)` → void: показывает статус.

### Примеры
```js
// Экспорт одним кликом (уже привязан к кнопке #exportData)
exportAppData();

// Импорт из выбранного файла
const file = document.querySelector('#importFile').files[0];
importAppData(file).then(msg => console.log(msg));
```
