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
    return number[e.userDevice] ? false : (number[e.userDevice] = true);
  });
  return calls
}

function OneNumber(CallInfo){
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
  
  const Calls = await CallLog.find();
  const archUser1 = await getCallLogs(idUser1);
  const archUser2 = await getCallLogs(idUser2);
  const result = [];

  const callCounts = Calls.reduce((acc, { number, type, userDevice }) => {
    if (type !== "REJECTED_TYPE" && type !== "MISSED_TYPE") {
      const phoneNumber = number.replace("+591", "");
      acc[phoneNumber] = acc[phoneNumber] || {};
      acc[phoneNumber][userDevice] = (acc[phoneNumber][userDevice] || 0) + 1;
    }
    return acc;
  }, {});

  const setArchUser1 = new Set(archUser1.map(({ number }) => number.replace("+591", "")));
  const setArchUser2 = new Set(archUser2.map(({ number }) => number.replace("+591", "")));

  const commonNumbers = Array.from(setArchUser1).filter(number => setArchUser2.has(number));

  commonNumbers.forEach(commonNumber => {
    const callCountsUser1 = callCounts[commonNumber] || {};
    const callCountsUser2 = callCounts[commonNumber] || {};

    const matchingContacts = archUser1.filter(({ number }) => number.replace("+591", "") === commonNumber);

    matchingContacts.forEach(({ number: number1, nameContact: nameContact1, userDevice: userDevice1 }) => {
      const matchingContact2 = archUser2.find(({ number }) => number.replace("+591", "") === commonNumber);
      const { nameContact: nameContact2, userDevice: userDevice2 } = matchingContact2;

      if (nameContact1 === "UNKNOWN") {
        nameContact1 = "";
      }
      
        const callCount1 = callCountsUser1[userDevice1] || 0;
        const callCount2 = callCountsUser2[userDevice2] || 0;
        if(callCount1 > 0){
        result.push({
        source: number1.replace("+591", ""),
        target: userDevice1,
        count: callCount1,
        namesContactsFromUsers1: nameContact1,
        namesContactsFromUsers2: nameContact2,
      })
   
    };
      
      if(callCount2 > 0){
      result.push({
        source: userDevice2,
        target: commonNumber,
        count: callCount2,
        namesContactsFromUsers1: nameContact1,
        namesContactsFromUsers2: nameContact2,
      })
      result.push({
        source: commonNumber,
        target: userDevice2,
        count: callCount2,
        namesContactsFromUsers1: nameContact1,
        namesContactsFromUsers2: nameContact2,
      })};
  });
  });

  return result;
};

const ComparativeCall = async (req, res = response) => {
  try {
    const Calls = await CallLog.find();
    const users = await UserDevice.find();
    const idUser1 = req.params.id1;

    const archUser1 = await getCallLogs(idUser1);
    const userName = await getUserDeviceById(idUser1);

    const result = [];

    await Promise.all(
      users.map(async ({ id: userId2}) => {
        if (idUser1 !== userId2) {
          const archUser2 = await getCallLogs(userId2);
          const userName2 = await getUserDeviceById(userId2);
          const archOneContact = OneNumber(archUser2);

          archOneContact.forEach(({ number: number2, nameContact: nameContact2, userDevice: userDevice2, type: type1 }) => {
            archUser1.forEach(({ number: number1, nameContact: nameContact1, userDevice: userDevice1, type: type2 }) => {

            const callCount1 = archUser1.filter(({ number: number1, nameContact: nameContactUser1, userDevice: userDevice1, type: type2 }) => {
              return type2 !== "REJECTED_TYPE" && type2 !== "MISSED_TYPE" && number1 === number2;
            }).length;

            const callCount2 = archUser2.filter(({ number: number1, nameContact: nameContact2, userDevice: userDevice1, type: type2 }) => {
              return type2 !== "REJECTED_TYPE" && type2 !== "MISSED_TYPE" && number1 === number2;
            }).length;

            if (number1.replace("+591", "") === number2.replace("+591", "")) {
              if (nameContact1 === "UNKNOWN" && nameContact2 !== "UNKNOWN") {
                nameContact1 = `${nameContact1}`;
              }

              if (nameContact1 && nameContact2 !== "UNKNOWN") {
                if (nameContact1 !== nameContact2) {
                  nameContact1 = `${nameContact1}`;
                }
              }
            if (type1 !== "REJECTED_TYPE" && type1 !== "MISSED_TYPE") {
              if(callCount1 > 0 && callCount2 > 0){
              result.push({
                userID1: userDevice1,
                number1: `${number1}`.replace("+591", ""),
                userName1: userName.nameUser, 
                namesContactsFromUsers1: `${nameContact1}`,
                count1: callCount1,
                userID2: userDevice2,
                userName2: userName2.nameUser,
                number2: `${number2}`.replace("+591", ""),
                namesContactsFromUsers2: `${nameContact2}`,
                count2: callCount2,
              });
              }}
          }}); 
          });
        }
      })
    );

    console.log(result);
    const uniqueResults = Array.from(new Set(result.map(JSON.stringify))).map(JSON.parse);

    return res.status(200).json({
      transaction: true,
      code: 0, // Excepcion controllada
      uniqueResults,
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

const getUserDeviceById = async (userDeviceId) => {
  //const userDeviceId = req.params.id;
  try {
    const userDevice = await UserDevice.findById(userDeviceId);
    if (!userDevice) {
      console.log("UserDevice no existe por ese id")
   
    }
    return userDevice

  } catch (error) {
    console.log(error);
   
  }
}


const getAllUser = async (req, res = response) => {
  try {
    const [users, calls] = await Promise.all([
      UserDevice.find(),
      CallLog.find()
    ]);
    const nodeSet = new Set();
    const userMap = new Map(users.map(({ _id, nameUser }) => [`${_id}`, nameUser]));

    const callCounts = new Map();
    const link = [];
    const result = [];
    const nodos = [];

    const comparativeCalls = await Promise.all(
      users.map(async (user, i) => {
        const userId1 = user._id;
        const userId2s = users.slice(i + 1).map(u => u._id);
    
        const comparativeContacts = await Promise.all(
          userId2s.map(userId2 => getComparativeCall(userId1, userId2))
        );
    
        return comparativeContacts.flat();
      })
    );
    

    for (const comparativeContacts of comparativeCalls) {
      result.push(...comparativeContacts);
    }

   

    for (const call of calls) {
      const { number, type,userDevice } = call;
      const phoneNumber = `${number}`.replace("+591", "");

      if (type === "OUTGOING_TYPE" || type === "INCOMING_TYPE" ) {
        callCounts.set(phoneNumber, (callCounts.get(phoneNumber) || 0) + 1);
      }

      const callCount = callCounts.get(phoneNumber) || 0;

      if (type !== "REJECTED_TYPE" && type !== "MISSED_TYPE") {
        
        link.push({
          source: call.userDevice,
          target: phoneNumber,
          type,
          count: callCount
        });
        // link.push({
        //   source: phoneNumber,
        //   target: call.userDevice,
        //   type,
        //   count: callCount
        // });
      }
    }

  const nodosUpdate = calls;
   //const linkUpdate = OrderforSort(calls);

    for (const { nameContact, number,type } of nodosUpdate) {
      
      if (type !== "REJECTED_TYPE" && type !== "MISSED_TYPE") {
        const phoneNumber = `${number}`.replace("+591", "");
    
        // Verificar si el nodo no existe en el conjunto antes de agregarlo
        if (!nodeSet.has(phoneNumber)) {
          nodeSet.add(phoneNumber);  
      nodos.push({
        userDevice: `${number}`.replace("+591", ""),
        name: nameContact
      });
      }
    }
    }

    const ContactOrder = OneContact(nodos);
    const ContacLink = OneTarget(link);

    const OneResult = OneTarget(result);

    const node = ContactOrder.concat(
      users.map(({ _id }) => ({
        userDevice: _id,
        name: userMap.get(`${_id}`)
      }))
    );

    const links = result.concat(ContacLink);

    const data = {
      nodes: node,
      links: links
    };

    return res.status(200).json({
      transaction: true,
      code: 0,
      data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      transaction: false,
      code: -2,
      msg: "Excepcion No Controlada, por favor informe al administrador."
    });
  }
};

module.exports = {
  getUserDeviceById,
  getAllUser,
  ComparativeCall,
}