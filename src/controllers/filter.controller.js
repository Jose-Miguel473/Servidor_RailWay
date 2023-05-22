const fs = require("fs");
const { response } = require("express");
const UserDevice = require("../models/UserDevice.model");
const CallLog = require("../models/CallLog.model");
const { calculateObjectSize } = require("bson");
const path = require("path");
const { userInfo } = require("os");



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

 const getComparativeCall = async (idUser1, idUser2) => {
   
  const Calls = await CallLog.find()
  const archUser1 = await getCallLogs(idUser1)
  const archUser2 = await getCallLogs(idUser2)
  const result = [];
    let count = 0;
    

    const callCounts = {};

  Calls.forEach(({number, type}) => {
  // Verificar si el número de origen y destino son iguales
  if (number === number && type == "OUTGOING_TYPE" || type == "INCOMING_TYPE" ) {
    // Incrementar el contador correspondiente
    const phoneNumber = `${number}`.replace("+591", "");
    callCounts[phoneNumber] = callCounts[phoneNumber] || 0;
    callCounts[phoneNumber]++;
  }
});

    archUser1.forEach(({ number: number1, nameContact: nameContact1, userDevice: userDevice1,type:type }) => {
      archUser2.forEach(({ number: number2, nameContact: nameContact2, userDevice: userDevice2,type:type }) => {
        if (number1 === number2) {
          if (nameContact1 === "UNKNOWN" && nameContact2 !== "UNKNOWN") {
            nameContact1 = `${nameContact1}`;
          }
    
          if (nameContact1 && nameContact2 !== "UNKNOWN") {
            if (nameContact1 !== nameContact2) {
              nameContact1 = `${nameContact1}`;
            }
          }
          if(archUser1 !== null && archUser2 !== null){
            const source = `${number1}`.replace("+591","");
            const callCount1 = callCounts[source] || 0;
          if (type !== "REJECTED_TYPE" && type !== "MISSED_TYPE"){
          result.push({
            source: `${number1}`.replace("+591", ""),
            target: `${userDevice1}`,
            count: callCount1,
            namesContactsFromUsers1: `${nameContact1}`,
            namesContactsFromUsers2: `${nameContact2}`,
            
          });
          const source = `${number2}`.replace("+591","");
          const callCount2 = callCounts[source] || 0;
          result.push({
            source: `${number2}`.replace("+591", ""),
            target: `${userDevice2}`,
            count: callCount2,
            namesContactsFromUsers1: `${nameContact1}`,
            namesContactsFromUsers2: `${nameContact2}`,
            
          });
        }
      }
          count += 1;
        }
      });
    });
  
    return result
};



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
  return CallInfo
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

 try{ 
  const User = await UserDevice.find()
  const Calls = await CallLog.find()
  
  const nodos = []
  const link = []
  const user = []
  const result = []
  

  User.map(({ _id,nameUser}) => {
    user.push({
     userDevice: `${_id}`,
     name:`${nameUser}`,
  });
}) 
       const nodoUpdate = OneContact(Calls)
       const linkUpdate = OrderforSort(Calls)
          
       nodoUpdate.map(({nameContact,number}) => {
         nodos.push({
          userDevice: `${number}`.replace("+591",""),
          name:`${nameContact}`,
       });
     }) 

     for (let i = 0; i < user.length; i++) {
      const userId1 = user[i].userDevice; // Obtén la ID del primer usuario
  
      // Recorrer los usuarios restantes
      for (let j = i + 1; j < user.length; j++) {
        const userId2 = user[j].userDevice; // Obtén la ID del segundo usuario
    
        const ComparativeContacts =  await getComparativeCall(userId1, userId2);
        
            result.push(...ComparativeContacts)
        
      }
    }

const callCounts = {};

Calls.forEach(({number, type}) => {
  // Verificar si el número de origen y destino son iguales
  if (number === number && type == "OUTGOING_TYPE" || type == "INCOMING_TYPE" ) {
    // Incrementar el contador correspondiente
    const phoneNumber = `${number}`.replace("+591", "");
    callCounts[phoneNumber] = callCounts[phoneNumber] || 0;
    callCounts[phoneNumber]++;
  }
});

linkUpdate.map(({userDevice, number,type}) => {
    const source = `${number}`.replace("+591","");
    const callCount = callCounts[source] || 0;
    if (type !== "REJECTED_TYPE" && type !== "MISSED_TYPE"){
    link.push({ 
      source:`${userDevice}`,
      target: `${number}`.replace("+591",""),
      type: `${type}`,
      count: callCount
    });
  }
  })

 const ContactOrder = nodos
 const ContacLink = OneTarget(link)
 const OneResult = OneTarget(result)

 console.log(OneResult)
  var node = ContactOrder.concat(user)
  var links = ContacLink.concat(OneResult)
 

  const data = {
    nodes: node,
    links: links

  }

 //fs.writeFileSync('./src/data/datosGeneral.json', JSON.stringify(data));

  return res.status(200).json({
    transaction: true,
    code: 0, // Respuesta Existosa
    data,
  });
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
       const resultComparative = OneContact(result) 

  return res.status(200).json({
      transaction: true,
      code: 0,  //Excepcion controllada
      resultComparative
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
  ComparativeCall,
}