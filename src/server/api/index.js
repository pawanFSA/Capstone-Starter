const { ServerError } = require("../errors");

const jwt = require("./auth/jwt");

const router = require("express").Router();
module.exports = router;

// Attaches user to res.locals if token is valid
router.use(async (req, res, next) => {
  // Check for token
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // "Bearer <token>"
  if (!authHeader || !token) {
    return next();
  }
  // Get user from token
  try {
    const { id } = jwt.verify(token);
    const user = await client.query(
      `
      SELECT * FROM users
      WHERE id = $1
    `,
      [id]
    );
    res.locals.user = user;
    next();
  } catch (err) {
    console.error(err);
    next(new ServerError(401, "Invalid token."));
  }
});

router.use("/auth", require("./auth"));
