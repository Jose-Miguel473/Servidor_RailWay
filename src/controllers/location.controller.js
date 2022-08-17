const { response } = require("express");
const Location = require("../models/Location.model");

const getLocations = async (req, res = response) => {
  // console.log("UID - GET:",req.uid);
  const userDevice = req.uid;
  try {
    const locations = await Location.find({ userDevice }).populate(
      "userDevice",
      "nameUser"
    );
    // const Locations = await Location.find().populate("userDevice", "nameUser")

    return res.status(200).json({
      transaction: true,
      code: 0,
      locations,
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

const registerLocation = async (req, res = response) => {
  // console.log("UID - POST:",req.uid);
  const location = new Location(req.body);

  try {
    location.userDevice = req.uid;

    const locationSaved = await location.save();

    return res.status(201).json({
      transaction: true,
      code: 1,
      location: locationSaved,
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

const updateLocation = async (req, res = response) => {
  const locationId = req.params.id;
  const uid = req.uid;

  try {
    const location = await Location.findById(locationId);

    if (!location) {
      return res.status(404).json({
        transaction: false,
        code: -3, 
        msg: "Location no existe por ese id",
      });
    }

    if (location.userDevice.toString() !== uid) {
      return res.status(401).json({
        transaction: false,
        code: -4, 
        msg: "No tiene privilegio de editar este Location",
      });
    }

    const newLocation = {
      //   ...req.body,
      addressLines: req.body.addressLines,
      countryName: req.body.countryName,
      user: uid,
    };

    const locationUpdated = await Location.findByIdAndUpdate(
      locationId,
      newLocation,
      { new: true }
    );

    return res.json({
      transaction: true,
      code: 3,
      Location: locationUpdated,
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
  getLocations,
  registerLocation,
  updateLocation,
};
/*
Code:
  -4 = sin privilegios
  -3 = Inexistente
  -2 = Excepcion
  -1 = No Registro
  0 = Peticion correcta
  1 = Registro existente
  2 = Redundancia
  3 = Actualizacion
*/