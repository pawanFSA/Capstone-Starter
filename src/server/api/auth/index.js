const { ServerError } = require("../../errors");
const client = require("../../db/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = require("express").Router();
const SALT_ROUNDS = 10;
module.exports = router;

/** Creates new account and returns token */
router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if username and password provided
    if (!username || !password) {
      throw new ServerError(400, "Username and password required.");
    }

    // Check if account already exists
    const user = await client.query(
      `
      SELECT * FROM users
      WHERE username = $1 
    `,
      [username]
    );

    if (!user) {
      throw new ServerError(401, "That user name already exists");
    }

    // Create new user
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const {
      rows: [newUser],
    } = await client.query(
      `
      INSERT INTO users(username, password)
      VALUES($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING *`,
      [username, hash]
    );

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

/** Returns token for account if credentials valid */
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if username and password provided
    if (!username || !password) {
      throw new ServerError(400, "Username and password required.");
    }

    // Check if account exists
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT * FROM users
      WHERE username = $1 
    `,
      [username]
    );

    if (!user) {
      throw new ServerError(
        400,
        `Account with username ${username} does not exist.`
      );
    }

    // Check if password is correct
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new ServerError(401, "Invalid password.");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    next(err);
  }
});
