# Firebase Storage Rules — качване

Същата процедура като Firestore Rules, но за Storage tab-а.

## Стъпки

1. Отвори [Firebase Console](https://console.firebase.google.com/) → твоя проект
2. Лявото меню → **Build → Storage**
3. Ако още не си активирал Storage → натисни **Get started** → избери production mode
4. След като Storage е активен → таб **Rules** най-горе
5. Изтрий всичко вътре
6. Отвори `storage.rules` от твоя проект, копирай съдържанието
7. Постави го във Firebase Console
8. Натисни **Publish**

## Какво правят правилата

| Path | Кой чете | Кой пише |
|---|---|---|
| `/courses/{id}/cover.{jpg,png,webp,...}` | всички (публична корица за каталога) | само admin, ≤ 5 MB, само image/* |
| `/courses/{id}/file.pdf` | **никой директно** (само през signed URL от API) | само admin, ≤ 200 MB, само application/pdf |
| всичко друго | denied | denied |

## Защо PDF-ът има `allow read: if false`?

PDF файлът е защитен и се сервира **само** през API endpoint `/api/courses/{id}/url`. Той проверява:
1. Имаш ли валиден Firebase Auth token?
2. Имаш ли courseId в `purchasedCourseIds`?

Ако да → API използва Firebase Admin SDK да генерира **signed URL** валиден 1 час. Този URL се изпраща на клиента и се ползва от PDF.js за рендериране.

Това означава, че дори да опиташ да отвориш направо `https://firebasestorage.googleapis.com/.../courses/X/file.pdf`, ще получиш `Permission denied` — точно както трябва.

## Тест

След публикуване на правилата:

1. Login като admin → таб „Курсове" → качи PDF → не трябва да има грешка
2. Logout → опитай да отвориш Storage URL-а на PDF директно в браузъра → трябва да получиш `403 Permission denied`
3. Login като клиент с покупка → отвори `/courses/{id}/viewer` → PDF се зарежда нормално (през signed URL)
