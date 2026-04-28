# CoreBuild – Backend

A CoreBuild webalkalmazás háttérkiszolgálója. Ez a Node.js + Express alapú szerver biztosítja a felhasználók kezelését, a termékek és alkatrészek lekérését, a rendelések feldolgozását, valamint a rendelés-visszaigazoló e-mailek küldését.

## Főbb jellemzők

- 🔐 **Felhasználókezelés** – regisztráció, bejelentkezés, kijelentkezés, JWT alapú hitelesítés (sütiben).
- 🛒 **Rendelések kezelése** – új rendelés létrehozása felhasználónként, fizetési mód tárolásával, visszaigazoló email küldése.
- 📦 **Termékkezelés** – általános terméklista és egyedi termék lekérése, létrehozása, módosítása, törlése (utóbbiak adminisztratív célra).
- 🧰 **Tervező API** – a számítógép-építő felülethez szükséges alkatrészkategóriák (processzor, hűtő, alaplap, videókártya, RAM, SSD/HDD, tápegység, ház, ventilátor) szűrt lekérése a terméktáblából.
- 📧 **Email értesítés** – sikeres rendelés után automatikus levél küldése a felhasználó email címére a rendelés adataival.
- 🗄️ **MySQL adatbázis** – connection pool segítségével, egyszerű, biztonságos adatkezelés.

## API végpontok és funkcióik

### Felhasználók (`/users/`)

| Metódus | Végpont               | Hitelesítés | Leírás |
|---------|----------------------|-------------|--------|
| `POST`  | `/users/register`    | nincs       | Új felhasználó regisztrálása (username, email, phone, password). A jelszót bcrypt kódolja. |
| `POST`  | `/users/login`       | nincs       | Bejelentkezés (email, password). Sikeres esetén JWT-t állít be sütiben (`token` cookie). |
| `GET`   | `/users/whoami`      | szükséges (`authenticateToken`) | Bejelentkezett felhasználó adatainak visszaadása (user_id, email, username, role, phone_num). |
| `POST`  | `/users/logout`      | szükséges | Kijelentkezés: törli a token sütit. |
| `GET`   | `/users/all`         | nincs       | Az összes felhasználó listázása (admin oldalhoz). |
| `DELETE`| `/users/delete/:user_id` | nincs (de csak admin oldalról hívható) | Felhasználó törlése azonosító alapján. |

### Rendelések (`/orders/`)

| Metódus | Végpont               | Hitelesítés | Leírás |
|---------|----------------------|-------------|--------|
| `POST`  | `/orders/create`     | szükséges   | Új rendelés létrehozása. Body: `product_id`, `quantity`, `fizetesi_mod`. A rendeléshez a felhasználó adatait a tokenből veszi. Sikeres mentés után a felhasználónak email visszaigazolást küld. |
| `GET`   | `/orders/get/:order_id` | szükséges | A bejelentkezett felhasználó összes rendelésének lekérése (az order_id-t jelenleg nem használja szűrésre, a user_id-hez tartozó összeset adja vissza). |
| `DELETE`| `/orders/:order_id`  | szükséges   | Egy adott rendelés törlése (csak a felhasználó saját rendelését törölheti). |
| `GET`   | `/orders/all`        | nincs       | Az összes rendelés listázása (admin célra). |

### Termékek (`/products/`)

| Metódus | Végpont                      | Hitelesítés | Leírás |
|---------|-----------------------------|-------------|--------|
| `GET`   | `/products/get`             | nincs       | Az összes termék lekérése (általános terméklista). |
| `GET`   | `/products/:product_id`     | nincs       | Egy termék lekérése `products_id` alapján. |
| `POST`  | `/products/create`          | nincs       | Új termék létrehozása (name, price). |
| `PUT`   | `/products/update/:product_id` | szükséges | Termék nevének és árának módosítása. |
| `DELETE`| `/products/delete/:product_id` | szükséges | Termék törlése (csak akkor, ha nincs hozzá kapcsolódó rendelés). |

### Tervező alkatrészek (`/tervezo/`)

Ezek a végpontok a terméktáblából név szerint szűrve adják vissza a megfelelő kategóriába tartozó alkatrészeket. Nem igényelnek hitelesítést.

| Metódus | Végpont              | Leírás |
|---------|---------------------|--------|
| `GET`   | `/tervezo/processors`   | Processzorok (név LIKE "%processzor%", kivéve hűtős, vízhűtéses találatok). |
| `GET`   | `/tervezo/fans`         | Ventilátorok (név LIKE "%ventilátor%"). |
| `GET`   | `/tervezo/cases`        | Számítógépházak (név LIKE "%ház%"). |
| `GET`   | `/tervezo/tapegyseg`    | Tápegységek (név LIKE "%tápegység%"). |
| `GET`   | `/tervezo/coolings`     | Processzor hűtők (név LIKE "%hűtő%" vagy "%vízhűtés%"). |
| `GET`   | `/tervezo/storages`     | SSD és HDD meghajtók (név LIKE "%SSD%" vagy "%HDD%"). |
| `GET`   | `/tervezo/boards`       | Alaplapok (név LIKE "%alaplap%"). |
| `GET`   | `/tervezo/ram`          | Memóriamodulok (név LIKE "%RAM%"). |
| `GET`   | `/tervezo/graphicsCard` | Videokártyák (név LIKE "%videokártya%"). |

## Hitelesítési folyamat

1. **Bejelentkezés/Regisztráció**: sikeres hitelesítés után a szerver egy JWT tokent állít elő, amely tartalmazza a felhasználó azonosítóját, email címét, nevét, szerepkörét és telefonszámát. Ezt a tokent egy `httpOnly`, `secure`, `sameSite: 'lax'` sütiben (`token`) küldi el a kliensnek.
2. **Védett végpontok**: az `authenticateToken` middleware ellenőrzi a sütiben lévő tokent. Ha hiányzik vagy érvénytelen, 401-es hibával tér vissza. Ha érvényes, a dekódolt adatokat (`req.user`) továbbadja a vezérlőnek.
3. **Kijelentkezés**: a `/users/logout` meghívásakor a szerver törli a sütit, így a kliens nem tud többé hitelesített kérést végrehajtani.

## Rendelés és email értesítés

- A `POST /orders/create` végponton a felhasználó a termék azonosítóját, mennyiséget és fizetési módot küld.
- A szerver először lekéri a felhasználó adatait (email, név) a `user_id` alapján, majd beszúrja a rendelést az `orders` táblába.
- Ezután meghívja az `sendOrderConfirmationEmail` szolgáltatást, amely egy Gmail SMTP-n keresztül elküldi a rendelés részleteit a felhasználónak.
- Sikeres beszúrás esetén a válasz tartalmazza a létrehozott rendelés `order_id`-ját.

## Adatbázis

A backend MySQL adatbázist használ, amelynek kapcsolatát a `db.js` konfigurálja egy kapcsolatkészlettel (max. 10 kapcsolat). Az adatbázis neve, felhasználó, jelszó környezeti változókból (`process.env`) jön, a `dotenvConfig.js` segítségével.

### Táblák (logikai)

- **users**: felhasználók adatai (user_id, username, password (hash), email, phone_num, role).
- **products**: az összes termék (alkatrész) adatai (products_id, name, price). A kategóriákat a névben szereplő kulcsszavak alapján szűri a tervező modul.
- **orders**: rendelések (order_id, user_id, product_id, fizetesi_mod, quantity).

## Biztonság

- Jelszavak bcrypt hash-sel tárolása, sózási kör 15.
- JWT token biztonságos sütiben (`httpOnly`, `secure`, `sameSite: 'lax'`), így JavaScript nem fér hozzá.
- CORS csak a megadott frontend eredeteket fogadja el (local dev és Netlify).
- Bizonyos végpontokhoz hitelesítés szükséges; a rendelés törlésnél a felhasználói azonosító egyeztetése is megtörténik.

## Környezeti változók (.env)

A backend a következő változókat olvassa be:

- `HOST`, `PORT` – szerver ip és port
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_TIMEZONE` – adatbázis kapcsolat
- `JWT_SECRET`, `JWT_EXPIRES_IN` – token titok és élettartam
- `COOKIE_NAME` – a süti neve (pl. `token`)

## Összegzés

A CoreBuild backend egy jól strukturált REST API, amely lehetővé teszi a frontend számára a felhasználók kezelését, az alkatrészek böngészését, és a rendelések feldolgozását. A hitelesítés JWT alapú, az adatbázis MySQL, és a rendszer automatikus email visszaigazolást is küld a sikeres vásárlásokról. Moduláris felépítése könnyen bővíthető és karbantartható.

---
Készítette: [Szabó Attila | Szanyi Balázs] – CORE Build Projekt BACKEND, 2026.
