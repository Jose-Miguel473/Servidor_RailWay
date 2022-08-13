/*
    I/FULLADDRESS: {
        addressLines=Albuquerque, NM 87121, USA, 
        featureName=87121, 
        adminArea=New Mexico, 
        subAdminArea=null, 
        locality=Albuquerque, 
        thoroughfare=null, 
        countryCode=US, 
        countryName=United States, 
        latitude=35.1128064, 
        longitude=-106.8650395, 
        currentTime=2:25:52
    }
*/

const { Schema, model } = require("mongoose");
const LocationSchema = new Schema(
  {
    addressLines:{
        type: String,
        required: true
    },
    featureName:{
        type: String,
        required: true
    },
    adminArea:{
        type: String,
        required: true
    },
    subAdminArea:{
        type: String,
        required: true
    },
    locality:{
        type: String,
        required: true
    },
    thoroughfare:{
        type: String,
        required: true
    },
    countryCode:{
        type: String,
        required: true
    },
    latitude:{
        type: String,
        required: true
    },
    longitude:{
        type: String,
        required: true
    },
    currentTime:{
        type: String,
        required: true
    },
    userDevice: {
        type: Schema.Types.ObjectId,
        ref: 'UserDevice',
        requiredd: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

LocationSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("Location", LocationSchema);
