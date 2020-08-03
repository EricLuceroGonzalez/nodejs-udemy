const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
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
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody);
      const theMessage = parsedBody.split("=")[1];  // message=
      fs.writeFileSync("message.txt", theMessage);
    });
    res.statusCode = 302;
    res.setHeader("Location", "/");
    return res.end();
  }
  res.write("<html>");
  res.write("<head> <title>My first page</title></head>");
  res.write("<body> <h1>Hello from my Node Js Server!</h1></body>");
  res.write("</html>");
  res.end();
});

server.listen(3000);
