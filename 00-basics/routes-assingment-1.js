const fs = require("fs");

const reqHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write("<html>");
    res.write("<head> <title>Assignment 1</title></head>");
    res.write("<body>");
    res.write("<div> <h1>Assignment 1</h1></div>");
    // Generate a requesto to /create-user throuh POST method
    res.write(
      "<form action='/create-user' method='POST'> <input type='text' name='username'> <button type='submit'></button>Send</input></form>"
    );
    res.write("</body>");
    res.write("</html>");
    return res.end();
  }
  if (url === "/create-user" && method === "POST") {
    const body = [];
    req.on("data", (chunkPiece) => {
      console.log(chunkPiece);
      body.push(chunkPiece);
    });
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody);
      const theUser = parsedBody.split("=")[1];
      console.log(`the user: ${theUser}`);
      //   redirecto to root '/'
      res.statusCode = 302;
      res.setHeader("Location", "/");
      res.end();
    });
  }
};

module.exports = reqHandler;
