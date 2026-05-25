# Firestore Security Rules — как да ги активираш

В момента се вижда грешка `Missing or insufficient permissions` в конзолата — това означава, че Firestore не позволява четене/запис от приложението. Правилата трябва да се качат в Firebase Console.

## Опция 1 — Firebase Console (най-бързо, без CLI)

1. Отвори https://console.firebase.google.com/ → избери проекта
2. Странична лента → **Build** → **Firestore Database** → таб **Rules**
3. Копирай съдържанието на [firestore.rules](firestore.rules) от този repo и го постави
4. Натисни **Publish**

## Опция 2 — Firebase CLI (за повтаряем deploy)

```bash
npm install -g firebase-tools
firebase login
firebase init firestore     # избери същия проект, прескочи перизщвa
firebase deploy --only firestore:rules
```

`firebase init` ще създаде `firebase.json` и `.firebaserc` — commit ги в repo-то.

## Какво правят правилата накратко

| Документ | Кой може да чете | Кой може да пише |
|---|---|---|
| `/users/{email}` | `email == caller` OR admin | същото; admin може всичко; user НЕ може да си смени `role` или `status` |
| `/logs/{key}` | `key` принадлежи на caller OR admin | същото |
| `/admin_audit/{id}` | само admin | само admin (append-only) |
| всичко друго | denied | denied |

Admin email е hardcoded като `d.nikolova.haccp@gmail.com` в правилата.
