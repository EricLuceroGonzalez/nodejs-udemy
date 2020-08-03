const http = require("http");

const routes = require("./routes-assingment-1");

const server = http.createServer(routes);

server.listen(3000);
