const express = require("express");

const router = express.Router();

// Routes
router.get("/", (req, res, next) => {
  res.send("<h1>Hello world!, form Express! - shop.js</h1>");
});

module.exports = router;
