const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(__dirname);
const DB_PATH = path.join(DB_DIR, 'webhooks.db');

// Ensure the db directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create table with all integrity constraints
db.exec(`
  CREATE TABLE IF NOT EXISTS WebHook (
    Id          INTEGER PRIMARY KEY AUTOINCREMENT,
    Name        TEXT    NOT NULL UNIQUE CHECK(length(trim(Name)) > 0 AND length(Name) <= 120),
    Description TEXT    NOT NULL DEFAULT '' CHECK(length(Description) <= 500),
    URL         TEXT    NOT NULL CHECK(
                  length(trim(URL)) > 0
                  AND (
                    URL LIKE 'http://%'
                    OR URL LIKE 'https://%'
                  )
                )
  );
`);

module.exports = db;
