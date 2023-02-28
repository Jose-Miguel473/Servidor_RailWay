const { response } = require("express");
const UserDevice = require("../models/UserDevice.model");
const CallLog = require("../models/CallLog.model");
const callLog = require("../routes/callLog.routes");





const getAllCall = async (req, res = response) => {

    const userDevice = req.params.id
    
try {
  const CallLogs = await CallLog.find({userDevice})
    
    const CallInfo = []

     console.log("Fechas desordenadas", CallLogs)
    
     const sortByDate = (data) => 
       data.sort (({date: a}, {date: b}) => a < b ? -1 : a > b ? 1 : 0)
  
       const dateUpdate = sortByDate(CallLogs)
    
       dateUpdate.map(({ userDevice,nameContact, number,date}) => {
         CallInfo.push({ userDevice,nameContact, number,date})
     })
     console.log ("fechas ordenadas",CallInfo)
    
    return res.status(200).json({
        transaction: true,
        code: 0, // Respuesta Existosa
        CallInfo
      });
     
   
    } 
    
   
    
    catch (error) {  
      console.log(error);
      return res.status(500).json({
       transaction: false,
       code: -2,  //Excepcion no controllada
       msg:"Excepcion No Controlada, por favor informe al administrador.",
     });
    }
      
  }
  module.exports = {
    getAllCall,
  }