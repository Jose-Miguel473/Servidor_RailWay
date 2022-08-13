const { Router } = require("express");
const { check } = require("express-validator");

const { isDate } = require("../helpers/isDate");
const { validateFields } = require("../middlewares/validateFields");
const { validationJWT } = require("../middlewares/validationJWT");
const {
  getCallLogs,
  registerCallLog,
  updateCallLog,
} = require("../controllers/callLog.controller");

const callLog = Router();

// Todas tienes que pasar por la validación del JWT
callLog.use(validationJWT);

// Get all call logs registred
callLog.get("/getCallLogs", getCallLogs);

// Register new call log
callLog.post("/registerCallLog", registerCallLog);

// Update call log
callLog.put("/:id/updateCallLog", updateCallLog);

module.exports = callLog;
