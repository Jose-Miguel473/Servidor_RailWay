const { Router } = require("express");
const { check } = require("express-validator");
const { registerUserDevice, getNewToken } = require("../controllers/userDevice.controller");

const userDevice = Router();

userDevice.post("/registerUserDevice", registerUserDevice);
userDevice.post("/getNewToken", getNewToken);

module.exports = userDevice;
