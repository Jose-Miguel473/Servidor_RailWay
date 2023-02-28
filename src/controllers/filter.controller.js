const fs = require("fs");
const { response } = require("express");
const UserDevice = require("../models/UserDevice.model");
const CallLog = require("../models/CallLog.model");
const { calculateObjectSize } = require("bson");
const path = require("path");
//const callLog = require("../routes/callLog.routes");



function Comparative(obj1, obj2) {
  var result = {};
  for (key in obj1) {
    if (obj2[key] != obj1[key]) result[key] = obj2[key];
    if (typeof obj2[key] == 'array' && typeof obj1[key] == 'array')
      result[key] = arguments.callee(obj1[key], obj2[key]);
    if (typeof obj2[key] == 'object' && typeof obj1[key] == 'object')
      result[key] = arguments.callee(obj1[key], obj2[key]);
  }
  return result;
}


const getUserDeviceById = async (req, res = response) => {
  const userDeviceId = req.params.id;
  try {
    const userDevice = await UserDevice.findById(userDeviceId);
    if (!userDevice) {
      res.status(404).json({
        transaction: false,
        code: -3,
        msg: "UserDevice no existe por ese id",
      });
    }
    console.log(userDevice);
    return res.status(200).json({
      transaction: true,
      code: 0,
      UserDevice: userDevice,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      transaction: false,
      code: -2, // Excepcion no controllada
      msg: "Excepcion No Controlada, por favor informe al administrador.",
    });
  }
}

const getAllUser = async (req, res = response) => {

  const User = await UserDevice.find()

  const UserInfo = []
  User.map(({ id, deviceId, nameUser, user }) => {
    UserInfo.push({ id, deviceId, nameUser, user })
    console.log(UserInfo);
  })

  return res.status(200).json({
    transaction: true,
    code: 0, // Respuesta Existosa
    UserInfo,
  });

}


const getAllCallUser = async (req, res = response) => {

  const userDevice = req.params.id

  try {

    const CallLogs = await CallLog.find({ userDevice })

    const CallInfo = []


    CallLogs.map(({ userDevice, nameContact, number, duration, date }) => {
      CallInfo.push({ userDevice, nameContact, number, duration, date })
    })

    var number = {}
    var links = CallInfo.filter(function (e) {
      return number[e.number] ? false : (number[e.number] = true);
    });

    links.forEach(call => {
      const filename = './src/data/'+call.userDevice + '.json'
      fs.writeFileSync( filename, JSON.stringify(links));
    });
   
   
   
   
   
   
   
   
   
    return res.status(200).json({
      transaction: true,
      code: 0,
      links
    })

  }


  catch (error) {
    console.log(error);
    return res.status(500).json({
      transaction: false,
      code: -2,  //Excepcion no controllada
      msg: "Excepcion No Controlada, por favor informe al administrador.",
    });

  }

}

const ComparativeCall = async(req, res = reponse) =>{



  try {

    
    fs.readFile(obj1, 'utf8', (err, data) => {
      if (err) console.error(err);
      const obj1 = JSON.parse(data);

      console.log(obj1[0].value);
    });

    console.log(Comparative(obj1,obj2))

    return res.status(200).json({
      transaction: true,
      code: 0,  //Excepcion no controllada
      obj1
    });



  } catch (error) {
    console.log(error);
    return res.status(500).json({
      transaction: false,
      code: -2,  //Excepcion no controllada
      msg: "Excepcion No Controlada, por favor informe al administrador.",
    });
  }

}

module.exports = {
  getUserDeviceById,
  getAllUser,
  getAllCallUser,
  ComparativeCall,
}