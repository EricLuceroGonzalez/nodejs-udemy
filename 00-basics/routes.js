const fs = require("fs");
// function
const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write("<html>");
    res.write("<head> <title>Enter message page</title></head>");
    res.write(
      "<body> <form action='/message' method='POST'> <input type='text' name='message'> <button type='submit'></button>Send</input></form></body>"
    );
    res.write("</html>");
    return res.end();
  }
  if (url === "/message" && method === "POST") {
    // de-chunk data "stored" in constant body
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody);
      const theMessage = parsedBody.split("=")[1]; // message=
      fs.writeFile("message.txt", theMessage, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      }); // Sync: freeze the code execution until file is ready
    });
  }
  res.write("<html>");
  res.write("<head> <title>My first page</title></head>");
  res.write("<body> <h1>Hello from my Node Js Server!</h1></body>");
  res.write("</html>");
  res.end();
};

// export this
module.exports = requestHandler;
