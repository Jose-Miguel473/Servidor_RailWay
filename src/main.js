const { App } = require("./App");
const { PORT } = require("./config");

App.listen(PORT);
console.log("Server on Port:", PORT);
