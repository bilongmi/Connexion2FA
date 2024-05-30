const { DATABASE_NAME } = require("../constants/shared");
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(`./database/${DATABASE_NAME}`, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log(`Connected to the ${DATABASE_NAME} database.`);
        db.run(`CREATE TABLE IF NOT EXISTS users(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      secret TEXT
                            )`);

        db.run(`CREATE TABLE IF NOT EXISTS verification_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      code TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    }
});

module.exports = {
    db
};