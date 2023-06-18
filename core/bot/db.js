const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

var db;

try {
  db = new sqlite3.Database("../../db.sqlite3");
} catch {
  fs.writeFile("../../db.sqlite3", "", (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });

  db = new sqlite3.Database("../../db.sqlite3");
}

db.run(
  `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, login TEXT, password TEXT)`,
);
db.run(
  `CREATE TABLE IF NOT EXISTS urlBlacklist (id INTEGER PRIMARY KEY, url TEXT)`,
);

module.exports = db;
