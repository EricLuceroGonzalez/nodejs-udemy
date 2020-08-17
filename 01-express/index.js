const path = require("path");
const express = require("express");
// We need to parse the body (chunks), because node doesnt do (body-parser)
const bodyParser = require("body-parser");
// run express as function
const app = express();

const errorController = require('./controllers/errorPage')
// Import the ejs files
app.set("view engine", 'ejs');
app.set("views", "views");

// Import the routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
// Grant access to public folder
app.use(express.static(path.join(__dirname, "public")));
// Use the admin Routes as middleware
app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);

// When reach this - no middleware found:
app.use(errorController.get404);
app.listen(3000);
