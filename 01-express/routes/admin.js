const path = require("path");
const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin-controller");

// Variable that save products
const products = [];

// The routes:
// implement the middleware 'use' that receive al incoming requests
// Handle the authorization and routes with /middleware/is-auth
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator");

router.get("/products", isAuth, adminController.getProducts);
router.get("/add-product", isAuth, adminController.getAddProduct);
router.post(
  "/add-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("imageUrl").isURL(),
    body("description").isLength({ min: 5, max: 200 }).trim(),
  ],
  isAuth,
  adminController.postAddProduct
);
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);
router.post(
  "/edit-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price", "Prices is not valid").isFloat(),
    body("imageUrl").isURL(),
    body("description").isLength({ min: 5, max: 200 }).trim(),
  ],
  isAuth,
  adminController.postEditProduct
);
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

exports.routes = router;
exports.products = products;
