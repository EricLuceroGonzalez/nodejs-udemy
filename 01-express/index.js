const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
// We need to parse the body (chunks), because node doesnt do (body-parser)
const bodyParser = require("body-parser");
// run express as function
const app = express();
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
  User.findById("608ba25ef8185436497f9869")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// Use the admin Routes as middleware
app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);

// When reach this - no middleware found:
app.use(errorController.get404);

// connect with mongoose

mongoose
  .connect(process.env.DB_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    // Check if there is a user
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Eric",
          email: "eric@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

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
