const fs = require("fs");
const { response } = require("express");
const UserDevice = require("../models/UserDevice.model");
const CallLog = require("../models/CallLog.model");
const { calculateObjectSize } = require("bson");
const path = require("path");
//const callLog = require("../routes/callLog.routes");






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

    const idUser1 = req.params.id1
    const idUser2 = req.params.id2

    const filename = "./src/data/"+ idUser1 +".json"
    const filename2 = "./src/data/" + idUser2 + ".json"
    
    const archUser1 = JSON.parse(fs.readFileSync(filename, { encoding: "utf-8" }));
    const archUser2 = JSON.parse(fs.readFileSync(filename2, { encoding: "utf-8" }));
  
   

     const compare = (user1 = [], user2 = []) => {
       const result = [];
       let count = 0
    
       user1.map(({ number: number1, nameContact: nameContact1, userDevice: userDevice1 }) => {
         user2.map(({ number: number2, nameContact: nameContact2,  userDevice: userDevice2 }) => {
           if (number1 === number2) {
             if (nameContact1 === "UNKNOWN" && nameContact2!== "UNKNOWN") {
                 nameContact1 = nameContact2
             }
    
             if(nameContact1 && nameContact2 !== "UNKNOWN"){
                 if (nameContact1 !== nameContact2) {
                     nameContact1 = `${nameContact1}, ${nameContact2}`
                 }
             }
    
             result.push({
               description: `${userDevice1} - ${userDevice2}`,
               number: `${number1}`.replace("+591", ""),
               namesContactsFromUsers: `${nameContact1}`,
             });
             count +=1
           }
         });
       });
       
      result.forEach(user => {
       const filename = './src/data/'+user.description + '.json'
       fs.writeFileSync( filename, JSON.stringify(result));
     });

      return {result,count};
     };
    
     const evalar = (user1 = [], user2 = []) => {
       if (user1.length >= user2.length) {
         return compare(user1, user2);
       } else {
         return compare(user2, user1);
       }
      
     }; 
     
  const resultado = evalar(archUser1,archUser2)

    return res.status(200).json({
      transaction: true,
      code: 0,  //Excepcion no controllada
      resultado
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