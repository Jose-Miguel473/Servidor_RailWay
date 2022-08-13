const { response } = require("express");
const jwt = require("jsonwebtoken");

const validationJWT = (req, res = response, next) => {
  const token = req.header("x-token");
  console.log(token);
  if (!token) {
    return res.status(401).json({
      transaction: false,
      msg: "No hay token en la peticion",
    });
  }
  try {
    const { uid, nameUser, deviceId } = jwt.verify(
      token,
      process.env.SECRET_JWT_SEED
    );
    // console.log(payload)

    req.uid = uid;
    req.nameUser = nameUser;
    req.deviceId = deviceId;
  } catch (error) {
    return res.status(401).json({
      transaction: false,
      msg: "Token no valido",
    });
  }
  next();
};

module.exports = { validationJWT };
