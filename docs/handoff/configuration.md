# Конфигурация

Исходные значения задаются в корневых env-файлах; шаблон — `.env.example`. Валидация — `functions/src/config/project.ts`, настройки приложения — `src/config/`, Functions — `functions/src/config/environment.ts`.

## Выбор окружения

`configure` и `check:config` по умолчанию читают development; `--production` выбирает production. `check` и `verify:clean` используют production.

Приоритет: переменные процесса → `.env.<режим>.local` → `.env.local` → `.env.<режим>` → `.env`. Для раздельной настройки подходят `.env.development.local` и `.env.production.local`. Общий `.env.local` перекрывает `.env.production`. Значения `NEXT_PUBLIC_*` встраиваются при сборке; изменение требует пересборки.

Реальные env-файлы исключены из Git. Примеры не создают сервисы и не являются готовой конфигурацией.

## Сайт и Firebase

| Переменная | Назначение |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | Origin приложения без пути, например `https://app.example.com` |
| `NEXT_PUBLIC_PUBLISHED_SITE_URL` | Отдельный origin публикаций, например `https://pages.example.com` |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Email поддержки |
| `NEXT_PUBLIC_SOCIAL_PROFILES` | Необязательные HTTPS-ссылки через запятую |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | API key Firebase Web App |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `authDomain` Web App |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ID выбранного Firebase-проекта |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Имя бакета без `gs://` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` Web App |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `appId` Web App |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Необязательный `measurementId`; сам не включает аналитику |
| `NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION` | Регион Functions |
| `NEXT_PUBLIC_FIREBASE_FUNCTIONS_ORIGIN` | HTTP-origin эмулятора только для разработки; в production пустой |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 для App Check; обязателен при HTTPS-origin приложения |
| `NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN` | Зарегистрированный debug token или `true` для его создания; только локально |
| `FIRESTORE_LOCATION` | Расположение Firestore в `firebase.json`; не переносит существующую базу |
| `CORS_EXTRA_ORIGINS` | Дополнительные точные HTTP(S)-origins через запятую, без `*` |
| `GOOGLE_SITE_VERIFICATION` | Необязательное значение метатега проверки сайта |

Приложение должно находиться вне пространства поддоменов публикаций. `app.example.com` и `pages.example.com` допустимы; `app.pages.example.com` и `pages.example.com` конфликтуют.

HTTP Functions используют `https://REGION-PROJECT_ID.cloudfunctions.net/ИМЯ_ЭКСПОРТА`. Callable SDK использует тот же проект и регион. Отдельные URL-переменные для каждой функции не нужны.

## Polar и ИИ

| Переменная | Назначение |
| --- | --- |
| `POLAR_SERVER` | Обязательное `sandbox` или `production` |
| `POLAR_ACCESS_TOKEN` | Серверный токен выбранного окружения Polar |
| `POLAR_PRODUCT_CREATOR_MONTHLY`, `POLAR_PRODUCT_CREATOR_YEARLY` | UUID продуктов Creator |
| `POLAR_PRODUCT_ARCHIVE_MONTHLY`, `POLAR_PRODUCT_ARCHIVE_YEARLY` | UUID продуктов Archive |
| `POLAR_CREDITS_PRODUCT_ID` | UUID продукта пополнения с custom amount |
| `OPENAI_API_KEY` | Серверный ключ ИИ |
| `OPENAI_TEXT_MODEL` | Модель с параметрами, используемыми в `src/lib/ai/server/openai.ts` |
| `OPENAI_IMAGE_MODEL` | Модель с параметрами из `src/lib/ai/server/enhance-photo.ts` |

Токен и продукты Polar должны принадлежать одному окружению. Модели должны быть доступны аккаунту владельца ключа.

`POLAR_WEBHOOK_SECRET` читает только Function `webhookPolar` из Secret Manager; корневая конфигурация Next.js его не использует, `configure` его не создаёт.

Для локального Firebase Admin доступны ADC, `GOOGLE_APPLICATION_CREDENTIALS` или пара `FIREBASE_ADMIN_CLIENT_EMAIL` и `FIREBASE_ADMIN_PRIVATE_KEY`. Ключ поддерживает последовательности `\n`; одиночная переменная из пары отклоняется.

## Генерируемые файлы

```powershell
npm.cmd run configure -- --production
npm.cmd run check:config -- --production
npm.cmd run configure -- --check --production
```

Последняя команда проверяет результат без записи.

| Файл | Изменения генератора |
| --- | --- |
| `apphosting.yaml` | Полный файл: публичные настройки, параметры интеграций и ссылки на секреты |
| `.firebaserc` | `projects.default`; другие aliases и targets сохраняются |
| `firebase.json` | Только `firestore.location` |
| `storage-cors.json` | Точные origins приложения, базового домена публикаций и дополнительные origins |
| `functions/.env` | Домены, поддержка, регион и дополнительные origins; другие назначения сохраняются |

Генератор не применяет настройки в облаке. Значения `OPENAI_API_KEY`, `POLAR_ACCESS_TOKEN` и App Check debug token не записываются в `apphosting.yaml`. Изменения генерируемых лимитов или состава настроек вносятся в `scripts/configure-project.mjs`.

`functions/.env.<project или alias>` и `functions/.env.local` могут перекрывать базовый `functions/.env` при запуске Firebase CLI. Генератор и `check:config` ими не управляют.

`npm.cmd run check:config -- --integrations --production` дополнительно проверяет наличие локальных ключа ИИ и токена Polar. Проверка не обращается к API и не проверяет права, продукты или баланс провайдеров.
