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

    return res.json({
      transaction: true,
      locations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      transaction: false,
      msg: "Excepcion No Controlada, por favor informe al administrador.",
    });
  }
};

const registerLocation = async (req, res = response) => {
  // console.log("UID - POST:",req.uid);
  const { number } = req.body;
  const location = new Location(req.body);

  try {
    // let locationNumber = await Location.findOne({ number });
    // if (locationNumber) {
    //   return res.status(400).json({
    //     transaction: false,
    //     msg: "El numero ya fue registrado.",
    //   });
    // }
    location.userDevice = req.uid;

    const locationSaved = await location.save();

    return res.json({
      transaction: true,
      Location: locationSaved,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      transaction: false,
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
        msg: "Location no existe por ese id",
      });
    }

    if (location.userDevice.toString() !== uid) {
      return res.status(401).json({
        transaction: false,
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
      Location: locationUpdated,
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
  getLocations,
  registerLocation,
  updateLocation,
};
