# Stripe & Firebase Admin SDK Setup

Това ръководство описва как да активираш плащанията през Stripe и server-side Firebase Admin SDK достъпа.

---

## 1. Stripe акаунт + ключове

1. Регистрирай се на [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. След вход → **Developers → API keys** → копирай:
   - **Publishable key** (започва с `pk_test_...` или `pk_live_...`)
   - **Secret key** (`sk_test_...` или `sk_live_...`)
3. В лявото меню → **Settings → Branding** → задай лого и цвят
4. **Settings → Payment methods** → активирай карти и (опционално) Apple Pay/Google Pay

---

## 2. Firebase Admin SDK service account

1. Firebase Console → **Project settings** (зъбчатка горе вляво) → таб **Service accounts**
2. Натисни **Generate new private key** → изтегли JSON файла
3. Base64-енкодвай го (за да го сложиш в `.env.local`):

   **Windows PowerShell:**
   ```powershell
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\path\to\serviceAccountKey.json")) | Set-Clipboard
   ```

   **Mac/Linux:**
   ```bash
   base64 -i serviceAccountKey.json | pbcopy   # или > clipboard
   ```

4. **Никога** не commit-вай този JSON файл в git! Добави го в `.gitignore`.

---

## 3. `.env.local`

Създай файла `.env.local` в корена на проекта (вече има `.env.local` за Firebase config — допълни го):

```bash
# Firebase (вече ги имаш от преди)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Firebase Admin (server-side) — base64-encoded JSON от стъпка 2
FIREBASE_SERVICE_ACCOUNT_BASE64=eyJ0eXBlIjoic2VydmljZV9hY2NvdW50...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...           # ще го получиш в стъпка 4
```

След промяна на `.env.local` рестартирай `npm run dev`.

---

## 4. Stripe webhook (локално)

За локално развитие webhook-ът не може да достигне `localhost` директно. Ползвай Stripe CLI:

1. Инсталирай Stripe CLI: [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
2. Логни се: `stripe login`
3. В отделен терминал:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. CLI ще покаже `Ready! Your webhook signing secret is whsec_xxx` → копирай в `.env.local` като `STRIPE_WEBHOOK_SECRET`
5. Рестартирай dev сървъра.

При production deploy:
- Stripe Dashboard → **Developers → Webhooks → Add endpoint**
- URL: `https://your-domain.com/api/stripe/webhook`
- Event: `checkout.session.completed`
- Копирай новия signing secret в `.env.production` или във Vercel/Netlify env vars

---

## 5. Тест на flow-а

1. Login като admin → Profile → таб **„Курсове (Книжарница)"**
2. Качи тестов PDF (под 5 MB препоръчително за бърз тест), цена `1.00` лв.
3. Logout
4. Отвори `/bookstore` в incognito → виж курса
5. Click „Купи с карта" → въведи `4242 4242 4242 4242` (Stripe test card)
   - CVC: всякакво (напр. `123`)
   - Дата: всяка бъдеща (напр. `12 / 30`)
6. След успешно плащане → redirect към `/courses/{id}/success`
7. Изпратеният от Stripe webhook ще създаде:
   - `/purchases/{stripeSessionId}` в Firestore
   - Firebase Auth акаунт за email-а
   - Запис в `/users/{email}` с `purchasedCourseIds: [courseId]`
8. Купувачът получава email от Firebase Auth с линк „Задай парола"
9. След като зададе парола → влиза в `/profile` → таб „Моите курсове" → отваря PDF в защитен viewer

---

## 6. Test cards (Stripe)

| Карта | Резултат |
|---|---|
| `4242 4242 4242 4242` | Успех |
| `4000 0025 0000 3155` | Изисква 3D Secure (тест на потвърждение) |
| `4000 0000 0000 9995` | Отказана (insufficient funds) |

Пълен списък: [https://stripe.com/docs/testing](https://stripe.com/docs/testing)

---

## 7. Чек-лист преди production

- [ ] Сменил си test ключовете с live ключовете в production env vars
- [ ] Добавил си production webhook endpoint в Stripe Dashboard
- [ ] Активирал си Apple Pay/Google Pay (опционално)
- [ ] Тествал си с малка реална сума (1 лв.) преди да обявиш
- [ ] Качил си `firestore.rules` и `storage.rules` (виж `FIRESTORE_RULES_DEPLOY.md` и `STORAGE_RULES_DEPLOY.md`)
- [ ] Service account JSON НЕ е в git (`.gitignore`)

---

## Troubleshooting

**„Missing FIREBASE_SERVICE_ACCOUNT_BASE64 env var"**
→ Provided JSON не е base64. Проверката го очаква base64 string. Или ползвай `FIREBASE_SERVICE_ACCOUNT` (raw JSON) вместо това.

**„Invalid webhook signature"**
→ `STRIPE_WEBHOOK_SECRET` не съответства на CLI / production endpoint. Препоръчвам да startпуснеш отново `stripe listen` и копираш новия secret.

**„permission-denied" при качване на PDF**
→ Не си публикувал новия `storage.rules` във Firebase Console. Виж `STORAGE_RULES_DEPLOY.md`.

**Buyer не получава email от Firebase Auth**
→ Провери Firebase Console → Authentication → Templates → Password reset. По подразбиране email идва от `noreply@<project>.firebaseapp.com`. Може да configure-неш custom SMTP за по-добър branding.
