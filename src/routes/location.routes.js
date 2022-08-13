const { Router } = require("express");
const { check } = require("express-validator");

const { isDate } = require("../helpers/isDate");
const { validateFields } = require("../middlewares/validateFields");
const { validationJWT } = require("../middlewares/validationJWT");
const {
  getLocations,
  registerLocation,
  updateLocation,
} = require("../controllers/location.controller");

const location = Router();

// Todas tienes que pasar por la validación del JWT
location.use(validationJWT);

// Get all call logs registred
location.get("/getLocations", getLocations);

// Register new call log
location.post("/registerLocation", registerLocation);

// Update call log
location.put("/:id/updateLocation", updateLocation);

module.exports = location;
