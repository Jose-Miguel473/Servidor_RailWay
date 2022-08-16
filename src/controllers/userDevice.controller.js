const { response } = require("express");
const { generateJWT } = require("../helpers/jwt");
const UserDevice = require("../models/UserDevice.model");

const getUserDevice = async (req, res = response) => {
  try {
    const userDevice = await UserDevice.find();
    // const userDevice = await UserDevice.find().populate("userDevice", "nameUser")

    return res.json({
      transaction: true,
      userDevice,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      transaction: false,
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
        msg: "El ID del dispositivo ya se encuentra registrando.",
      });
    }
    userDevice = new UserDevice(req.body);

    await userDevice.save();

    // Generate Token
    const token = await generateJWT(
      userDevice.id,
      userDevice.nameUser,
      userDevice.deviceId
    );

    return res.status(201).json({
      transaction: true,
      uid: userDevice.id,
      name: userDevice.nameUser,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      transaction: false,
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

    return res.json({
      transaction: true,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      transaction: false,
      msg: "Excepcion No Controlada, por favor informe al administrador.",
    });
  }
};

const getTokenUserDevice = async (req, res = response) => {
  const deviceId = req.params.id;

  try {
    console.log("Req.Id", deviceId);
    const userDevice = await UserDevice.findOne({deviceId});

    console.log("USER:",userDevice.id, userDevice.nameUser, userDevice.deviceId);
    // Generate New JSON WEB TOKEN - JWT
    const token = await generateJWT(
      userDevice.id,
      userDevice.nameUser,
      userDevice.deviceId
    );
    return res.json({
      transaction: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      transaction: false,
      msg: "Excepcion No Controlada, por favor informe al administrador.",
    });
  }
};

module.exports = {
  getUserDevice,
  registerUserDevice,
  getNewToken,
  getTokenUserDevice,
};
