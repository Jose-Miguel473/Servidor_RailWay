const jwt = require("jsonwebtoken");

const generateJWT = (uid, deviceId, manufacturer, model) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, deviceId, manufacturer, model };
    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: "24h", //tiempo de duracion del token
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("Error al generar token");
        }
        resolve(token);
      }
    );
  });
};

module.exports = { generateJWT };
