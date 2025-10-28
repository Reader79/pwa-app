# PWA Приложение для управления сменами

Современное Progressive Web App для управления рабочими сменами с календарем и настройками.

## 🚀 Возможности

- **Календарь смен** с цветовой индикацией
- **Настройки оператора** (ФИО, номер смены, базовое время)
- **Управление станками** - список доступных станков
- **Управление деталями** - операции с временными расчетами
- **Автоматический расчет** смен по 16-дневному циклу
- **Праздничные дни** с учетом производственного календаря
- **Офлайн работа** - полная поддержка без интернета
- **Установка как приложение** на любое устройство
- **Отчеты** - 6 типов отчетов для анализа производительности
- **Импорт/Экспорт** - резервное копирование и перенос данных

## 🎨 Дизайн

- Современная темная тема с градиентами
- Адаптивный дизайн для всех устройств
- Плавные анимации и переходы
- Интуитивно понятный интерфейс

## 📱 PWA функции

- ✅ Service Worker для офлайн работы
- ✅ Web App Manifest для установки
- ✅ HTTPS для безопасности
- ✅ Кэширование ресурсов
- ✅ Автоматические обновления

## 🛠 Технологии

- **HTML5** - семантическая разметка
- **CSS3** - современные стили с переменными
- **JavaScript ES6+** - модульная архитектура
- **Service Worker** - офлайн функциональность
- **Web App Manifest** - PWA метаданные

## 📦 Структура проекта

### 📁 working-version/pwa-working/
**Рабочая версия приложения** - НЕ ИЗМЕНЯТЬ!
- Это стабильная, работающая версия PWA приложения
- Используется только для продакшена
- Любые изменения запрещены

### 📁 debug-version/pwa-debug/
**Отладочная версия** - для разработки новых функций
- Копия рабочей версии для экспериментов
- Здесь можно добавлять новые функции и отлаживать их
- После тестирования новые функции переносятся в рабочую версию

## 🌐 Онлайн версии

- **Рабочая версия**: [https://reader79.github.io/pwa-app/](https://reader79.github.io/pwa-app/)
- **Отладочная версия**: [https://reader79.github.io/pwa-app-debug/](https://reader79.github.io/pwa-app-debug/)

## 🔄 Workflow разработки

1. **Работаем только в `debug-version/pwa-debug/`**
2. Тестируем новые функции в отладочной версии
3. После успешного тестирования переносим изменения в `working-version/pwa-working/`
4. Рабочая версия остается стабильной и неизменной во время разработки

## ⚠️ Важно!
⚠️ **НИКОГДА не изменяйте файлы в `working-version/pwa-working/` напрямую!**
⚠️ **Все разработки ведите только в `debug-version/pwa-debug/`!**

## 📚 Документация

Полная документация доступна в следующих файлах:

- **[API Documentation](API_DOCUMENTATION.md)** - Comprehensive API reference for all public functions and components
- **[User Guide](USER_GUIDE.md)** - Подробное руководство пользователя на русском языке
- **[Developer Guide](DEVELOPER_GUIDE.md)** - Technical guide for developers and contributors

### Быстрые ссылки

- [State Management API](API_DOCUMENTATION.md#state-management)
- [Calendar & Shift API](API_DOCUMENTATION.md#calendar--shift-management)
- [Record Management API](API_DOCUMENTATION.md#record-management)
- [Report Generation API](API_DOCUMENTATION.md#report-generation)
- [Data Import/Export API](API_DOCUMENTATION.md#data-importexport)
- [Usage Examples](API_DOCUMENTATION.md#usage-examples)

## 🚀 Быстрый старт для пользователей

1. Откройте [приложение](https://reader79.github.io/pwa-app/)
2. Нажмите ⚙️ **Настройки**
3. Заполните ФИО, номер смены и базовое время
4. Добавьте станки и детали с операциями
5. Начните вводить данные через кнопку **Ввод данных**

Подробнее см. [Руководство пользователя](USER_GUIDE.md).

## 💻 Быстрый старт для разработчиков

```bash
# Clone repository
git clone https://github.com/Reader79/pwa-app.git
cd pwa-app

# Install dependencies (optional)
npm install

# Start development server
npm start

# Open http://localhost:3000
```

Подробнее см. [Developer Guide](DEVELOPER_GUIDE.md).

## 🤝 Вклад в проект

Мы приветствуем вклад в проект! Пожалуйста:

1. Прочитайте [Developer Guide](DEVELOPER_GUIDE.md)
2. Следуйте [Code Conventions](DEVELOPER_GUIDE.md#code-conventions)
3. Создайте feature branch
4. Отправьте Pull Request

Подробнее см. [Contributing](DEVELOPER_GUIDE.md#contributing).

## 🌐 Деплой

Автоматический деплой на GitHub Pages при push в main ветку.

Подробнее о деплое см. [Deployment Guide](DEVELOPER_GUIDE.md#deployment).

## 📄 Лицензия

MIT License
