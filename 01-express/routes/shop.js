const path = require("path");
const express = require("express");

const router = express.Router();

// Root dir:
const rootDir = require("../util/path");
// to use products variable
const adminData = require("./admin");
// Routes
router.get("/", (req, res, next) => {
    console.log('shop:', adminData.products);
    const products = adminData.products;
    res.render('shop', {
        prods: products,
        pageTitle: 'shop',
        path:'/',
        hasProducts: products.length>0,
        activeShop: true,
        productsCSS: true,
    })
});

module.exports = router;
