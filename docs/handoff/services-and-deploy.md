# Сервисы и развёртывание

Нужны Firebase-проект, домены, продукты Polar и ключ ИИ. Значения окружения описаны в [конфигурации](configuration.md).

## Firebase

Создайте проект с биллингом, Web App, Firestore `(default)` и Storage. Задайте расположение базы в `FIRESTORE_LOCATION` и регион Functions в `NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION` до развёртывания.

В Authentication включите Google, Email/Password, Email Link и Anonymous. Anonymous используется гостями мероприятий. Добавьте домен приложения и `localhost` в authorized domains. Настройте шаблоны писем с возвратом на `/auth/finish`; входящие `/__/auth/action` обрабатывает `src/proxy.ts`.

Подключите App Check с reCAPTCHA v3 и доменами приложения. Для SafeSearch включите Cloud Vision API. Плановые функции используют Cloud Scheduler.

Сервисным аккаунтам Next.js и Functions нужны права на используемые Auth, Firestore и Storage. Для V4 signed PUT URL гостевых фотографий аккаунту Functions требуется `iam.serviceAccounts.signBlob` на аккаунте-подписанте.

## Домены

| Адрес | Назначение |
| --- | --- |
| `https://app.example.com` | Приложение, кабинет, редактор и API |
| `https://pages.example.com/album?share=TOKEN` | Фотокнига или мероприятие |
| `https://cafe.pages.example.com` | Портфолио или меню |
| `https://cafe.pages.example.com/drinks` | Страница меню |

DNS и TLS приложения, базового домена публикаций и `*.pages.example.com` должны направлять запросы в Next.js с исходным `Host` или доверенным `x-forwarded-host`. Хостинг должен поддерживать wildcard-маршрутизацию и сертификат. Генератор конфигурации их не создаёт. [Домены App Hosting](https://firebase.google.com/docs/app-hosting/custom-domain).

## Polar

Создайте Creator и Archive с месячным и годовым интервалами: четыре продукта. Metadata `tier` задайте как `creator` или `archive`; сервер определяет тариф по этому полю. UUID запишите в `POLAR_PRODUCT_*`.

Для пополнения кредитов нужен продукт с custom amount и `POLAR_CREDITS_PRODUCT_ID`. Расчёт пополнения — `src/app/api/billing/buy-credits/route.ts`; лимиты подписки — `functions/src/users/upsertSubscription.ts` и `src/lib/billing/`. Изменения условий требуют согласования продуктов, серверных значений и pricing.

Создайте access token и webhook в том же окружении, что `POLAR_SERVER`:

```text
https://REGION-PROJECT_ID.cloudfunctions.net/webhookPolar
```

События: `order.created`, `order.refunded`, `subscription.created`, `subscription.updated`, `subscription.canceled`, `subscription.revoked`. Signing secret хранится как `POLAR_WEBHOOK_SECRET`. Подпись проверяется по исходному телу запроса.

## Секреты

Создайте App Hosting backend для репозитория. Замените значения в командах:

```powershell
$milestisProjectId = 'PROJECT_ID'
$milestisBackendId = 'BACKEND_ID'
$milestisBackendRegion = 'REGION'
npm.cmd exec -- firebase login
npm.cmd exec -- firebase apphosting:secrets:set polar-access-token --project $milestisProjectId
npm.cmd exec -- firebase apphosting:secrets:set openai-api-key --project $milestisProjectId
npm.cmd exec -- firebase apphosting:secrets:grantaccess 'polar-access-token,openai-api-key' --backend $milestisBackendId --location $milestisBackendRegion --project $milestisProjectId
npm.cmd exec -- firebase functions:secrets:set POLAR_WEBHOOK_SECRET --project $milestisProjectId
```

Значения вводятся в интерактивном запросе. `apphosting.yaml` содержит ссылки на `polar-access-token` и `openai-api-key`. После обновления секретов нужен новый rollout, после смены webhook secret — деплой `webhookPolar`. [Секреты App Hosting](https://firebase.google.com/docs/app-hosting/configure#store-and-access-secret-parameters).

Ключ ИИ должен иметь доступ к моделям из окружения. Сборка внешние API не вызывает.

## Деплой

Заполните production env без emulator origin и App Check debug token:

```powershell
npm.cmd run configure -- --production
npm.cmd run check
git diff -- apphosting.yaml .firebaserc firebase.json storage-cors.json
```

Проверьте проект, бакет, продукты и ссылки на секреты. Переменные Firebase Console могут перекрывать `apphosting.yaml`; их значения должны быть согласованы.

```powershell
npm.cmd exec -- firebase deploy --only 'firestore:rules,firestore:indexes,storage,functions' --project $milestisProjectId
$milestisBucketName = 'BUCKET_NAME'
gcloud storage buckets update "gs://$milestisBucketName" --cors-file=storage-cors.json
```

Последняя команда заменяет CORS бакета; `firebase deploy` его не применяет. Деплой индексов включает TTL `menuBillingQuotes.deleteAt` из `firestore.indexes.json`.

Зафиксируйте публичные конфигурационные файлы в репозитории App Hosting и создайте rollout выбранной ветки или коммита через Firebase Console. `functions/.env` не входит в Git: на другой машине перед деплоем Functions нужен `configure -- --production`. Веб-сборка использует `apphosting.yaml`.

Дождитесь индексов, проверьте логи Functions и задания Scheduler, затем выполните [проверку сценариев](architecture-and-checks.md#проверка-на-развёрнутом-окружении).

| Задача | Расписание UTC |
| --- | --- |
| `expireCreditsCron` | Каждый час |
| `renewMenuBillingCron` | Каждый час |
| `purgeDeletedProjects` | Первого числа месяца в 00:00 |
