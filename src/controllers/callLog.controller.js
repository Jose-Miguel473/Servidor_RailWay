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
    CallInfo = []
    
    const sortByDate = (data) => 
    data.sort (({date: a}, {date: b}) => a < b ? -1 : a > b ? 1 : 0)

   
    const dateUpdate = sortByDate(callLogs)
 
    dateUpdate.map(({ userDevice,id,nameContact,duration,type,typeRaw,number,date}) => {
      CallInfo.push({ userDevice,id,nameContact,duration,type,typeRaw,number,date})
  })

   
  


  console.log ("fechas ordenadas",CallInfo)


    return res.status(200).json({
      transaction: true,
      code: 0,
      CallInfo,
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

const registerCallLog = async (req, res = response) => {
  // console.log("UID - POST:",req.uid);
  const { date } = req.body;
  const callLog = new CallLog(req.body);

  try {
    let callLogNumber = await CallLog.findOne({ date });
    if (callLogNumber) {
      return res.status(200).json({
        transaction: false,
        code: 2,
        msg: "El numero ya fue registrado.",
      });
    }
    callLog.userDevice = req.uid;

    const callLogSaved = await callLog.save();

    return res.status(201).json({
      transaction: true,
      code: 1,
      msg: "Registro Exitoso."
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

const updateCallLog = async (req, res = response) => {
  const callLogId = req.params.id;
  const uid = req.uid;

  try {
    const callLog = await CallLog.findById(callLogId);

    if (!callLog) {
      return res.status(404).json({
        transaction: false,
        code: -3,
        msg: "CallLog no existe por ese id",
      });
    }

    if (callLog.userDevice.toString() !== uid) {
      return res.status(401).json({
        transaction: false,
        code: -4,
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
      code: 3,
      CallLog: callLogUpdated,
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
  getCallLogs,
  registerCallLog,
  updateCallLog,
};
