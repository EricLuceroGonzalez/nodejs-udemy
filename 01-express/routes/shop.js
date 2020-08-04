const path = require("path");
const express = require("express");

const router = express.Router();

// Root dir:
const rootDir = require("../util/path");

// Routes
router.get("/", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = router;
