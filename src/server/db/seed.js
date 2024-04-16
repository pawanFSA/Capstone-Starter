const client = require("./client");

async function dropTables() {}

async function buildTables() {}

async function seedData() {}

async function init() {
  try {
    client.connect();
    await dropTables();
    await buildTables();
    await seedData();
  } catch (error) {
    client.end();
    process.exit(1);
  }
}

init();
