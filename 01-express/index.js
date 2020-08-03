const express = require("express");
// run express as function
const app = express();

// We need to parse the body (chunks), because node doesnt do (body-parser)
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// implement the middleware 'use' that receive al incoming requests
app.use("/add-product", (req, res, next) => {
  console.log("Inside the middleware");
  res.send(
    '<form action="/product" method="POST"> <input type="text" name="title"></input><button type="submit">Add product </button></form>'
  );
  //   next();
});

app.post("/product", (req, res, next) => {
  console.log("Product middleware");
  // get the body:
  console.log(req.body);

  res.redirect("/");
  // next(); //allows to continue to next middleware
});

app.use("/", (req, res, next) => {
  console.log("Last middleware");
  res.send("<h1>Hello world!, form express</h1>");
});

app.listen(3000);
