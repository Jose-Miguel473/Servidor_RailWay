const { response } = require("express");
const { generateJWT } = require("../helpers/jwt");
const UserDevice = require("../models/UserDevice.model");

const getUserDevice = async (req, res = response) => {
  try {
    const userDevice = await UserDevice.find();
    // const userDevice = await UserDevice.find().populate("userDevice", "nameUser")

    return res.status(200).json({
      transaction: true,
      code: 0, // Respuesta Existosa
      userDevice,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      transaction: false,
      code: -2, // Excepcion no controllada
      msg: "Excepcion No Controlada, por favor informe al administrador.",
    });
  }
};

const registerUserDevice = async (req, res = response) => {
  const { deviceId } = req.body;
  try {
    let userDevice = await UserDevice.findOne({ deviceId });
    if (userDevice) {
      return res.status(400).json({
        transaction: false,
        code: 2, // Registro existente
        msg: "El ID del dispositivo ya se encuentra registrando.",
      });
    }
    userDevice = new UserDevice(req.body);

    await userDevice.save();

    // Generate Token
    const token = await generateJWT(
      userDevice.id,
      userDevice.deviceId,
      userDevice.manufacturer,
      userDevice.model
    );

    return res.status(201).json({
      transaction: true,
      code: 1, // La peticion fue correcta
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      transaction: false,
      code: -2, // Excepcion no controllada
      msg: "Excepcion No Controlada, por favor informe al administrador.",
    });
  }
};

const getNewToken = async (req, res = response) => {
  const { deviceId } = req.body;
  try {
    const userDevice = await UserDevice.findOne({ deviceId });

    // console.log("USER:",userDevice.id, userDevice.nameUser, userDevice.deviceId);
    // Generate New JSON WEB TOKEN - JWT
    const token = await generateJWT(
      userDevice.id,
      userDevice.nameUser,
      userDevice.deviceId
    );

    return res.status(202).json({
      transaction: true,
      code: 1, 
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      transaction: false,
      code: -2, // Excepcion no controllada
      msg: "Excepcion No Controlada, por favor informe al administrador.",
    });
  }
};

module.exports = {
  getUserDevice,
  registerUserDevice,
  getNewToken,
};
