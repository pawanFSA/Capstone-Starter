const { Client } = require("pg");

const YOUR_DATABASE_NAME = "capstone";

const connectionString =
  process.env.DATABASE_URL || `https://localhost:5432/${YOUR_DATABASE_NAME}`;

const client = new Client({
  connectionString,
  // deployment platforms often require ssl support
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
});

module.exports = client;
