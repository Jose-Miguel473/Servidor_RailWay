const { response } = require("express");
const CallLog = require("../models/CallLog.model");

const getCallLogs = async (req, res = response) => {
  // console.log("UID - GET:",req.uid);
  const userDevice = req.uid;
  try {
    const callLogs = await CallLog.find({ userDevice }).populate(
      "userDevice",
      "nameUser"
    );
    // const callLogs = await CallLog.find().populate("userDevice", "nameUser")

    return res.json({
      transaction: true,
      callLogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      transaction: false,
      msg: "Excepcion No Controlada, por favor informe al administrador.",
    });
  }
};

const registerCallLog = async (req, res = response) => {
  // console.log("UID - POST:",req.uid);
  const { number } = req.body;
  const callLog = new CallLog(req.body);

  try {
    let callLogNumber = await CallLog.findOne({ number });
    if (callLogNumber) {
      return res.status(400).json({
        transaction: false,
        msg: "El numero ya fue registrado.",
      });
    }
    callLog.userDevice = req.uid;

    const callLogSaved = await callLog.save();

    return res.json({
      transaction: true,
      CallLog: callLogSaved,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      transaction: false,
      msg: "Excepcion No Controlada, por favor informe al administrador.",
    });
  }
};

const updateCallLog = async (req, res = response) => {
  const callLogId = req.params.id;
  const uid = req.uid;

  try {
    const callLog = await CallLog.findById(callLogId);

    if (!callLog) {
      return res.status(404).json({
        transaction: false,
        msg: "CallLog no existe por ese id",
      });
    }

    if (callLog.userDevice.toString() !== uid) {
      return res.status(401).json({
        transaction: false,
        msg: "No tiene privilegio de editar este CallLog",
      });
    }

    const newCallLog = {
      //   ...req.body,
      nameContact: req.body.nameContact,
      user: uid,
    };

    const callLogUpdated = await CallLog.findByIdAndUpdate(
      callLogId,
      newCallLog,
      { new: true }
    );

    return res.json({
      transaction: true,
      CallLog: callLogUpdated,
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
  getCallLogs,
  registerCallLog,
  updateCallLog,
};
