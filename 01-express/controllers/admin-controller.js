const { validationResult } = require("express-validator");
const Product = require("../models/product-model");

exports.getAddProduct = (req, res, next) => {
  // Show this route if user is logged in
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(('in here error:'));
    // console.log(errors.array());
    console.log(errors.array()[0].msg);
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
  });
  // Saved by mongoose
  product
    .save()
    .then((result) => {
      console.log(`res: ${result}`);
      console.log("Product Created");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(`res error: ${err}`);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  console.log(`editMode: ${editMode}`);
  if (!editMode) {
    res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => {});
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImage = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescr = req.body.description;
  const errors = validationResult(req)


  if (!errors.isEmpty()) {
    console.log(('in here error'));
    // console.log(errors.array());
    console.log(errors.array()[0].msg);
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDescr,
        imageUrl: updatedImage,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }


  Product.findById(prodId)
    .then((product) => {
      if (product.userId !== req.user._id) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImage;
      product.description = updatedDescr;
      return product.save().then((result) => {
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
// ? NEW: SELECT() + CHOICE INSIDE POPULATE WHICH ATTRIBUTE
exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select("title price -_id")
    // .populate("userId", "name email")
    .then((products) => {
      console.log("HERE!!");

      console.log(products);
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then((result) => {
      console.log("Deleted product!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
