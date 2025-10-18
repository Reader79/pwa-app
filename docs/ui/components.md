# Компоненты интерфейса и диалоги

Основные элементы интерфейса описаны в `index.html`, стилизованы через `styles.css`, а поведение задается в `app.js`.

## Главный экран
- **Кнопка «Ввод данных» (`#actionOne`)**: открывает диалог «Календарь смен».
- **Кнопка «Отчеты» (`#actionTwo`)**: открывает диалог «Отчеты».
- **Кнопка «Действие 3» (`#actionThree`)**: заглушка.

## Диалог «Календарь смен» (`#dataDialog`)
- Навигация по месяцам (`#prevMonth`, `#nextMonth`)
- Сетка календаря (`#calendar`) с цветовой индикацией смен и индикаторами наличия данных
- Кнопка «Добавить запись на выбранную дату» (`#addRecordFromCalendar`)
- Секция результатов дня (`#resultsSection`) с карточками станков и списком операций, кнопки редактирования/удаления используют глобальные API

## Диалог «Настройки» (`#settingsDialog`)
Вкладки (`.tabs`):
- `Основное`: поля `#operatorName`, `#shiftNumber`, `#baseTime`
- `Станки`: список `#machinesList`, добавление `#addMachine`
- `Детали`: список `#partsContainer`, добавление `#addPart`
- `Экспорт/Импорт`: кнопки `#exportData`, `#selectFile`, `#importData`, статус `#importStatus`

## Диалог «Добавить запись» (`#addRecordDialog`)
Поля ввода: дата, `recordMachine`, `recordPart`, `recordOperation`, `recordMachineTime`, `recordExtraTime`, `recordQuantity`. Выводит рассчитанное `#totalTimeDisplay`. Сохранение — кнопка `#saveRecord`.

## Диалог «Отчеты» (`#reportsDialog`)
- Выбор месяца (`#reportMonth`)
- Тип отчета (`#reportType`): efficiency, parts, machines, productivity, overtime, quality
- Секция вывода `#reportContent`

## Диалог «Подтверждение подработки» (`#overtimeDialog`)
- Кнопки: `#confirmOvertime`, `#cancelOvertime`

## Стили и классы
См. `styles.css` для классов: `.machine-card`, `.operation-card`, `.action-buttons`, `.results-table`, `.summary-table` и т.д. Макеты адаптивны для мобильных.

## Примеры сценариев использования
- Добавление станка/детали с операциями
- Ввод записей за день и просмотр результатов
- Генерация отчета за месяц по типу
- Экспорт и импорт данных между устройствами
