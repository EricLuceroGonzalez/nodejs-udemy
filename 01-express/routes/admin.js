const path = require("path");
const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin-controller");

// Variable that save products
const products = [];

// The routes:
// implement the middleware 'use' that receive al incoming requests
router.get("/add-product", adminController.getAddProduct);
router.get("/products", adminController.getProducts);
router.post("/add-product", adminController.postAddProduct);
router.get("/edit-product/:productId", adminController.getEditProduct);
router.post("/edit-product", adminController.postEditProduct);
router.post("/delete-product", adminController.postDeleteProduct);
exports.routes = router;
exports.products = products;
