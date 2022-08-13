const jwt = require("jsonwebtoken");

const generateJWT = (uid, nameUser, deviceId) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, nameUser, deviceId };
    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: "2h", //tiempo de duracion del token
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
