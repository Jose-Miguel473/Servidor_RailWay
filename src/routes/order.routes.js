const { Router } = require("express");
const { check } = require("express-validator");

const { isDate } = require("../helpers/isDate");
const { validateFields } = require("../middlewares/validateFields");
const { validationJWT } = require("../middlewares/validationJWT");
const {
    getAllCall
} = require("../controllers/order.controller");

const order = Router();

order.get("/:id/getAllCall",getAllCall);


module.exports = order;