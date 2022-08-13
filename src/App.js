const express = require("express");
const router = require("./routes/index.routes");
const cors = require("cors");
const morgan = require("morgan");
const userDevice = require("./routes/userDevice.routes");
const { dbConnection } = require("./databases/db.config");

const App = express();

// Init database
dbConnection();

App.use(cors());

//Deconstruction body to JSON
App.use(express.json());
App.use(morgan("dev"));

//Middleware
App.use("/api/userDevice", userDevice);

App.use(express.static("public"));

App.use(router);
module.exports = { App };
