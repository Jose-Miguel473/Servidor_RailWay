const { Router } = require("express");
const { check } = require("express-validator");

const { isDate } = require("../helpers/isDate");
const { validateFields } = require("../middlewares/validateFields");
const { validationJWT } = require("../middlewares/validationJWT");
const {
  getUserDeviceById, getAllUser,ComparativeCall
} = require("../controllers/filter.controller");

const filter = Router();

// Get all call logs registred
filter.get("/getUserDeviceById", getUserDeviceById);
filter.get("/getAllUser", getAllUser);
filter.get("/:id1/ComparativeCall",ComparativeCall)
// filter.get("/:id/getAllCallUser", getAllCallUser);


module.exports = filter;
