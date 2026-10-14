const path = require("path");
const express = require("express");

const router = express.Router();
// Handle the authorization and routes with /middleware/is-auth
const isAuth = require("../middleware/is-auth");
const shopsController = require("../controllers/shop-controller");
// Routes
router.get("/", shopsController.getIndex);

router.get("/products", shopsController.getProducts);
router.get("/products/:productId", shopsController.getProduct);
router.get("/cart",isAuth, shopsController.getCart);
router.post("/cart",isAuth, shopsController.postCart);
router.post("/cart-delete-item",isAuth, shopsController.postCartDelete)
router.post("/create-order",isAuth, shopsController.postOrder);
router.get("/orders",isAuth, shopsController.getOrders);
// router.get("/checkout", shopsController.getCheckout);

module.exports = router;
