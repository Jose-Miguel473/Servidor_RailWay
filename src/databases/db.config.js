
const {connect} = require("mongoose")
const { MONGODB_URI } = require("../config")
const dbConnection = async() => {
  try {
    const db = await connect(MONGODB_URI);
    console.log("DB connected to", db.connection.name);
  } catch (error) {
    
    console.log(error);
    throw new Error('Error a la hora de inicializar BD');
  }
}
module.exports = {dbConnection}