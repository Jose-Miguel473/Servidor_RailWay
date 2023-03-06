const express = require("express");
const router = require("./routes/index.routes");
const cors = require("cors");
const morgan = require("morgan");
const { dbConnection } = require("./databases/db.config");
const userDevice = require("./routes/userDevice.routes");
const callLog = require("./routes/callLog.routes");
const location = require("./routes/location.routes");
const admin = require("./routes/admin.routes");
const filter = require("./routes/filter.routes");
const order = require("./routes/order.routes");
const App = express();

// Init database
dbConnection();

App.use(cors());

//Deconstruction body to JSON
App.use(express.json());
App.use(morgan("dev"));

//Middleware
App.use("/api/v1/admin", admin);
App.use("/api/v1/userDevice", userDevice);
App.use("/api/v1/callLog", callLog);
App.use("/api/v1/location", location);
App.use("/api/v1/filter", filter);
App.use("/api/v1/order", order);
App.use(express.static("public"));

// App.use(router);
module.exports = { App };
