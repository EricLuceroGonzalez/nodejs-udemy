const express = require("express");
const router = express.Router();

// The routes:
// implement the middleware 'use' that receive al incoming requests
router.use("/add-product", (req, res, next) => {
  console.log("Inside the middleware");
  res.send(
    '<form action="/product" method="POST"> <input type="text" name="title"></input><button type="submit">Add product </button></form>'
  );
  //   next();
});

router.post("/product", (req, res, next) => {
  console.log("Product middleware");
  // get the body:
  console.log(req.body);

  res.redirect("/");
  // next(); //allows to continue to next middleware
});

module.exports = router;
