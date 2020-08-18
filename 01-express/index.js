const path = require("path");
const express = require("express");
// We need to parse the body (chunks), because node doesnt do (body-parser)
const bodyParser = require("body-parser");
// run express as function
const app = express();

// Import mongoConnect:
const mongoConnect = require("./util/database").mongoConnect;
const errorController = require("./controllers/errorPage");

// User Model
const User = require("./models/user-model");

// Import the ejs files
app.set("view engine", "ejs");
app.set("views", "views");

// Import the routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
// Grant access to public folder
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // find the user
  User.findById('5f3b19557906ebe4a8c94eca')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {});
});

// Use the admin Routes as middleware
app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);

// When reach this - no middleware found:
app.use(errorController.get404);

mongoConnect(() => {
  if (condition) {
  }
  app.listen(3000);
});
