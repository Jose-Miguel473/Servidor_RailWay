const { Router } = require("express");
const { check } = require("express-validator");
const { registerUserDevice, getNewToken, getUserDevice, getTokenUserDevice } = require("../controllers/userDevice.controller");

const userDevice = Router();

userDevice.get("/getUserDevice", getUserDevice);
userDevice.post("/registerUserDevice", registerUserDevice);
userDevice.post("/getNewToken", getNewToken);
userDevice.get("/:id/getTokenUserDevice", getTokenUserDevice);

module.exports = userDevice;
