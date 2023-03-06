require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI_TEST;
const PORT = process.env.PORT;

module.exports = { MONGODB_URI, PORT}