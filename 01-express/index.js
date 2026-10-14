const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
// We need to parse the body (chunks), because node doesnt do (body-parser)
const bodyParser = require("body-parser");
// the session package
const session = require("express-session");
// Register mongo session
var MongoDBStore = require("connect-mongodb-session")(session);
// Import the CSRF token to security
const csrf = require("csurf");
// run express as function
const app = express();
const store = new MongoDBStore({
  // server string
  uri: process.env.DB_TEST,
  collection: "sessions",
});
// Initialize CRSF
const csrfProtection = csrf();
// Import Connect-Flash
const flash = require("connect-flash");

const errorController = require("./controllers/errorPage");

// User Model
const User = require("./models/user-model");

// Import the ejs files
app.set("view engine", "ejs");
app.set("views", "views");

// Import the routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
// Grant access to public folder
app.use(express.static(path.join(__dirname, "public")));
// Session middleware init
app.use(
  session({
    secret: "my_secret_string",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());
// Middleware for auth:
app.use((req, res, next) => {
  // find the user
  if (!req.session.user) {
    console.log("no session");
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log("some error");

      console.log(err);
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Use the admin Routes as middleware
app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);
app.use(authRoutes);
// When reach this - no middleware found:
app.use(errorController.get404);

// connect with mongoose
mongoose
  .connect(process.env.DB_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    // Creates am USER
    app.listen(3000);
    console.log("connected!");
  })
  .catch((err) => {
    console.log("Error:");
    console.log(err);
  });

// mongoConnect(() => {
//   // if (condition) {
//   // }
//   app.listen(3000);
// });
