const path = require("path");
const express = require("express");

const router = express.Router();

const shopsController = require("../controllers/shop-controller");
// Routes
router.get("/", shopsController.getIndex);

router.get("/products", shopsController.getProducts);
router.get("/products/:productId", shopsController.getProduct);
router.get("/cart", shopsController.getCart);
router.post("/cart", shopsController.postCart);
router.post("/cart-delete-item", shopsController.postCartDelete)
router.get("/order", shopsController.getOrders);
router.get("/checkout", shopsController.getCheckout);

module.exports = router;
