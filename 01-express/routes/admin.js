const path = require("path");
const express = require("express");
const router = express.Router();

// Root dir:
const rootDir = require("../util/path");
// The routes:
// implement the middleware 'use' that receive al incoming requests
router.get("/add-product", (req, res, next) => {
  console.log("Inside the middleware");
  res.sendFile(path.join(rootDir, "views", "add-product.html"));
  //   res.send(
  //     '<form action="/product" method="POST"> <input type="text" name="title"></input><button type="submit">Add product </button></form>'
  //   );
  //   next();
});

router.post("/add-product", (req, res, next) => {
  console.log("Product middleware");
  // get the body:
  console.log(req.body);

  res.redirect("/");
  // next(); //allows to continue to next middleware
});

module.exports = router;
