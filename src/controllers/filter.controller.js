const fs = require("fs");
const { response } = require("express");
const UserDevice = require("../models/UserDevice.model");
const CallLog = require("../models/CallLog.model");
const { calculateObjectSize } = require("bson");
const path = require("path");
const { userInfo } = require("os");
//const callLog = require("../routes/callLog.routes");


function OneContact(CallInfo){
  var number = {}
  var calls = CallInfo.filter(function (e) {
    return number[e.number] ? false : (number[e.number] = true);
  });
  return calls
}
const OrderforSort = (data) => {
  data.sort (({userDevice: a}, {userDevice: b}) => a < b ? -1 : a > b ? 1 : 0)
return data
}

 function OneTarget(CallInfo){
   var number = {}
   var calls = CallInfo.filter(function (e) {
     return number[e.target] ? false : (number[e.target] = true);
   });
   return calls
 }

 const getCallLogs = async (userDevice) => {
  const CallLogs = await CallLog.find({ userDevice })
  const CallInfo = []
  let totalDuration = 0

  CallLogs.map(({ userDevice, nameContact, number, duration, date, type }) => {
          
    CallInfo.push({ 
      userDevice: `${userDevice}`,
      nameContact: `${nameContact}`,
      number: `${number}`.replace("+591",""),
      duration: `${duration}`,
      type:`${type}`,
      date:`${date}`
    })
  
  })
  return OneContact(CallInfo)
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
  const Calls = await CallLog.find()
  
  const nodos = []
  const link = []
  const user = []

  User.map(({ _id,nameUser}) => {
    user.push({
     userDevice: `${_id}`,
     name:`${nameUser}`,
  });
}) 
       const nodoUpdate = OrderforSort(Calls)
       const linkUpdate = OrderforSort(Calls)
          
       nodoUpdate.map(({nameContact,number}) => {
         nodos.push({
          userDevice: `${number}`.replace("+591",""),
          name:`${nameContact}`,
       });
     }) 

  linkUpdate.map(({userDevice, number}) => {
    link.push({ 
      source:`${userDevice}`,
      target: `${number}`.replace("+591",""),
    });
  })



  var ContactOrder = OneContact(nodos)
  

  var node = ContactOrder.concat(user)
  var links = OneTarget(link) 
 
  
  
  const data = {
    nodes: node,
    links: links

  }
 
    fs.writeFileSync('./src/data/datosGeneral.json', JSON.stringify(data));
 

  return res.status(200).json({
    transaction: true,
    code: 0, // Respuesta Existosa
    node,
  });

}

const ComparativeCall = async(req, res = reponse) =>{
  try {

    const idUser1 = req.params.id1
    const idUser2 = req.params.id2

    const archUser1 = await getCallLogs(idUser1)
    const archUser2 = await getCallLogs(idUser2)
    
    const result = [];
    
    let count = 0
    
       archUser1.map(({ number: number1, nameContact: nameContact1, userDevice: userDevice1 }) => {
         archUser2.map(({ number: number2, nameContact: nameContact2,  userDevice: userDevice2 }) => {
          
           if (number1 === number2) {
             if (nameContact1 === "UNKNOWN" && nameContact2!== "UNKNOWN") {
                 nameContact1 = `${nameContact1}`  
             }
    
             if(nameContact1 && nameContact2 !== "UNKNOWN"){
                 if (nameContact1 !== nameContact2) {
                     nameContact1 = `${nameContact1}`
                 }
             }
    
             result.push({
               userID1: `${userDevice1}`  ,
               number1: `${number1}`.replace("+591", ""),
               namesContactsFromUsers1: `${nameContact1}`, 
               userID2: `${userDevice2}`,
               number2: `${number2}`.replace("+591", ""),
               namesContactsFromUsers2: `${nameContact2}`,
             });
             count +=1
           }
          
         }); 
       });
    
  return res.status(200).json({
      transaction: true,
      code: 0,  //Excepcion controllada
      result
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
  // getAllCallUser,
  ComparativeCall,
}