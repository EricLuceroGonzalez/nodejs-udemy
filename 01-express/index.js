const express = require("express");
// run express as function
const app = express();

// Import the routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// We need to parse the body (chunks), because node doesnt do (body-parser)
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// Use the admin Routes as middleware
app.use(adminRoutes);
app.use(shopRoutes);

app.listen(3000);
