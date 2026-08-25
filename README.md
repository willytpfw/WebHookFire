# WebHookFire

A minimalist webhook manager built with **React 19 + Vite**, **Node.js / Express 5**, and **SQLite** (via `better-sqlite3`). Supports full CRUD, one-click HTTP POST execution, multilingual UI (EN/ES), and Docker deployment.

---

## Quick Start — Development

### Prerequisites
- Node.js 22+

### 1. Install server dependencies
```bash
cd server
npm install
```

### 2. Install client dependencies
```bash
cd ../client
npm install
```

### 3. Start the server (port 3001)
```bash
cd ../server
npm run dev
```

### 4. Start the client (port 5173)
```bash
cd ../client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Quick Start — Docker

```bash
# Build and run
docker compose up --build

# Access app
open http://localhost:3001
```

The SQLite database is persisted in the `./data/` folder (mapped to `/app/server/db` inside the container).

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/webhooks` | List all webhooks |
| `GET` | `/api/webhooks/:id` | Get a single webhook |
| `POST` | `/api/webhooks` | Create a webhook |
| `PUT` | `/api/webhooks/:id` | Update a webhook |
| `DELETE` | `/api/webhooks/:id` | Delete a webhook |
| `POST` | `/api/webhooks/:id/fire` | Execute POST to the webhook URL |

### WebHook Schema
```json
{
  "Id": 1,
  "Name": "My Webhook",
  "Description": "Optional description",
  "URL": "https://example.com/webhook"
}
```

---

## Database

SQLite file located at `server/db/webhooks.db`.

```sql
CREATE TABLE WebHook (
  Id          INTEGER PRIMARY KEY AUTOINCREMENT,
  Name        TEXT    NOT NULL UNIQUE CHECK(length(trim(Name)) > 0 AND length(Name) <= 120),
  Description TEXT    NOT NULL DEFAULT '' CHECK(length(Description) <= 500),
  URL         TEXT    NOT NULL CHECK(
                length(trim(URL)) > 0
                AND (URL LIKE 'http://%' OR URL LIKE 'https://%')
              )
);
```

---

## Languages

Switch between **English** and **Spanish** via the EN/ES toggle in the header. Language preference is saved in `localStorage`.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 6, Tailwind CSS 3, react-i18next |
| Backend | Node.js 22, Express 5, better-sqlite3 |
| Storage | SQLite (local file) |
| Icons | Heroicons v2 |
| Notifications | react-hot-toast |
| Container | Docker (multi-stage), Docker Compose |
