# Локальный запуск на Windows

Команды выполняются в PowerShell из корня репозитория. Требуются Git, Node.js 24 и npm. `npm.cmd` работает и при запрете запуска `npm.ps1`.

## Установка и окружение

```powershell
npm.cmd ci
npm.cmd --prefix functions ci
npm.cmd exec -- firebase --version
Copy-Item -LiteralPath .env.example -Destination .env.local
```

Копируйте пример только при первом запуске, чтобы не заменить настройки. Firebase CLI установлен в зависимостях; глобальная установка не нужна.

Заполните `.env.local` по [справочнику конфигурации](configuration.md): Firebase Web App, адреса приложения и публикаций, email поддержки, регион, продукты и режим Polar, имена моделей. Для тестовых платежей используйте `POLAR_SERVER=sandbox` и продукты sandbox.

Локальные адреса:

```dotenv
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PUBLISHED_SITE_URL=http://pages.localhost:3000
```

Приложение открывается на `localhost:3000`, публикации — на `pages.localhost:3000/slug` и `slug.pages.localhost:3000`. Если имена не разрешаются в loopback, нужен локальный DNS с поддоменами либо собственный тестовый домен. Хосты приложения и публикаций должны различаться.

```powershell
npm.cmd run configure
npm.cmd run check:config
npm.cmd run dev
```

В Firebase Authentication добавьте `localhost` в authorized domains и включите [используемые способы входа](services-and-deploy.md#firebase).

## Firebase Admin и интеграции

`firebase login` авторизует CLI, но не Next.js Admin SDK. Для серверных операций выберите:

- ADC: `gcloud auth application-default login` с правами на выбранный проект.
- Ключ сервисного аккаунта вне репозитория: `GOOGLE_APPLICATION_CREDENTIALS=C:/path/outside/repository/service-account.json` в `.env.local`.

В App Hosting используются учётные данные платформы. Для реальных вызовов ИИ и checkout нужны `OPENAI_API_KEY` и `POLAR_ACCESS_TOKEN`. Сборка и автоматические тесты не требуют этих двух секретов.

## Эмулятор Functions

Без отдельной настройки фронтенд вызывает развёрнутые Functions. Для локального эмулятора задайте:

```dotenv
NEXT_PUBLIC_FIREBASE_FUNCTIONS_ORIGIN=http://127.0.0.1:5001
```

Повторите `npm.cmd run configure`, перезапустите dev-сервер и в другом терминале выполните:

```powershell
npm.cmd --prefix functions run serve
```

Origin задаётся без пути. Переключаются HTTP и callable Functions; Auth, Firestore, Storage и внешние API остаются подключёнными к выбранным сервисам. Используйте отдельный Firebase-проект для разработки. В production emulator origin должен быть пустым.

## Production-сборка

```powershell
npm.cmd run configure -- --production
npm.cmd run check
npm.cmd run start
```

`check` проверяет конфигурацию, оба линтера, тесты и обе сборки. Если development и production используют разные env-файлы, перед возвращением к разработке снова выполните `npm.cmd run configure`.
