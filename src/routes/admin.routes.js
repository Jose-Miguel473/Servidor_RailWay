const { Router } = require("express");
const { check } = require("express-validator");
const {getAdmin, registerAdmin, updateAdmin} = require("../controllers/admin.controller");

const admin = Router();

admin.get("/getAdmin", getAdmin);
admin.post("/registerAdmin", registerAdmin);
admin.put("/updateAdmin", updateAdmin);

module.exports = admin;
