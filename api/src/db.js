const Database = require('better-sqlite3');

const db = new Database(':memory:');
db.exec(`
  create table users (id integer primary key, email text, name text, role text, ssn text);
  insert into users (email, name, role, ssn) values
    ('alice@example.com', 'Alice', 'admin', '111-22-3333'),
    ('bob@example.com', 'Bob', 'user', '444-55-6666');
`);

module.exports = db;
