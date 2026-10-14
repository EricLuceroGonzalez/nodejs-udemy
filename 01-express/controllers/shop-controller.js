const Product = require("../models/product-model");
const Order = require("../models/order-model");

exports.getProducts = (req, res, next) => {
  // fetch from db
  Product.find()
    .then((products) => {
      console.log(products);

      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((item) => {
      res.render("shop/product-detail", {
        product: item,
        pageTitle: item.title,
        path: "/products",
        
      });
    })
    .catch((err) => {
      console.log("getProduct");
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/"
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  console.log("----------------");
  // console.log(req.user);

  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      console.log("getCART");

      console.log(user.cart.items);
      const products = user.cart.items;

      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        
      });
    })
    .catch();
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      console.log(req);
      return req.user.addToCart(product);
      // Cart.addProduct(prodId, product.price);
    })
    .then((result) => {
      console.log("\n\npostCart");
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log("postCart error");
      console.log(err);
    });
};

exports.postCartDelete = (req, res, next) => {
  const prodId = req.body.productId;
  req.session.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  // Find this user-only orders
  Order.find({ "user.userId": req.user._id }).then((orders) => {
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders,
      
    });
  });
};

exports.postOrder = (req, res, next) => {
  // Get the user products
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      console.log("user.cart.items.productId");
      console.log(user.cart);
      const products = user.cart.items.map((item) => {
        // ? New: the _doc to 'populate'
        return {
          quantity: item.quantity,
          productData: { ...item.productId._doc },
        };
      });
      //  init a Order obj
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      // Save this order to db
      return order.save();
    })
    .then((result) => {
      // Clear the cart if order is sent
      req.user.clearCart();
    })
    .then(() => {
      // Once clear cart then resend
      console.log('Once clear cart then resend');
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};
