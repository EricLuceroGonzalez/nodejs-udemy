const path = require("path");

// find and export the file that starts the app
module.exports = path.dirname(process.mainModule.filename);
