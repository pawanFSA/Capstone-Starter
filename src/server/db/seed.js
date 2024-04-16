const client = require("./client");

async function dropTables() {
  await client.query(`DROP TABLE IF EXISTS users`);

  console.log("Tables Dropped");
}

async function buildTables() {
  await client.query(`
    CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);

  console.log("Users Table Created");
}

async function seedData() {}

async function init() {
  try {
    client.connect();
    await dropTables();
    await buildTables();
    await seedData();
  } catch (error) {
    process.exit(1);
  }
  await client.end();
}

init();
