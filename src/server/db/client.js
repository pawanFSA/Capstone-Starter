const { Client } = require("pg");

// First make sure you create a database locally!
const db = "capstone"; // replace with your db name

const connectionString =
  process.env.DATABASE_URL || `https://localhost:5432/${db}`;

const client = new Client({
  connectionString,
  // deployment platforms often require ssl support
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
});

module.exports = client;
