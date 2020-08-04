const path = require("path");
const express = require("express");
const router = express.Router();

// Root dir:
const rootDir = require("../util/path");

// Variable that save products
const products = [];

// The routes:
// implement the middleware 'use' that receive al incoming requests
router.get("/add-product", (req, res, next) => {
  console.log("Inside the middleware");
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activateAddProduct: true,
  });
});

router.post("/add-product", (req, res, next) => {
  console.log("Product middleware");
  // get the body:
  products.push({ title: req.body.title });

  res.redirect("/");
  // next(); //allows to continue to next middleware
});

exports.routes = router;
exports.products = products;
