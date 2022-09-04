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

    // Generate Token
    const token = await generateJWT(
      userDevice.id,
      userDevice.deviceId,
      userDevice.manufacturer,
      userDevice.model
    );

    userDevice.token = token;
    console.log(userDevice.token);
    await userDevice.save();

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

    userDevice.token = token;
    // console.log(userDevice);
    // console.log(req.body);
    updateUserDeviceToken(userDevice);

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

const updateUserDeviceToken = async (req, res = response) => {
  // console.log(req.id);
  const userDeviceId = req.id;

  try {
    const userDevice = await UserDevice.findById(userDeviceId);
    // console.log(userDevice);

    if (!userDevice) {
      res.status(404).json({
        transaction: false,
        code: -3,
        msg: "UserDevice no existe por ese id",
      });
    }

    const newUserDeviceToken = {
      token: req.token,
    };

    const userDeviceUpdated = await UserDevice.findByIdAndUpdate(
      userDeviceId,
      newUserDeviceToken,
      { new: true }
    );

    // return res.json({
    //   transaction: true,
    //   code: 3,
    //   // UserDevice: userDeviceUpdated,
    // });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      transaction: false,
      code: -2, // Excepcion no controllada
      msg: "Excepcion No Controlada, por favor informe al administrador.",
    });
  }
};

const updateUserDevice = async (req, res = response) => {
  const userDeviceId = req.params.id;
  const uid = req.uid;

  try {
    const userDevice = await UserDevice.findById(userDeviceId);
    if (!userDevice) {
      res.status(404).json({
        transaction: false,
        code: -3,
        msg: "UserDevice no existe por ese id",
      });
    }

    const newUserDevice = {
      nameUser: req.body.nameUser,
      user: uid,
    };

    const userDeviceUpdated = await UserDevice.findByIdAndUpdate(
      userDeviceId,
      newUserDevice,
      { new: true }
    );

    return res.json({
      transaction: true,
      code: 3,
      UserDevice: userDeviceUpdated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
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
  updateUserDevice,
};
