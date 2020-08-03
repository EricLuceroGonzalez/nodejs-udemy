const http = require("http");

// import express
const express = require("express");
// run express as function
const app = express();

// implement the middleware 'use' that receive al incoming requests
app.use((req, res, next) => {
  console.log("Inside the middleware");
  next(); //allows to continue to next middleware
});

app.use((req, res, next) => {
  console.log("Second middleware");
  res.send("<h1>Hello world!, form express</h1>");
  next(); //allows to continue to next middleware
});


const server = http.createServer(app)
server.listen(3000)