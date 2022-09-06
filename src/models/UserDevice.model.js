/*
{
    DEVICEID=926b9db85b8d4f83,
    USER=android-build, 
    HOST=wpra9.hot.corp.google.com, 
    FINGERPRINT=google/sdk_gphone_x86/generic_x86:10/QSR1.190920.001/5891938:user/release-keys, 
    HARDWARE=ranchu, 
    BOARD=goldfish_x86, 
    BOOTLOADER=unknown, 
    BRAND=google, 
    DEVICE=generic_x86, 
    DISPLAY=QSR1.190920.001, 
    ID=QSR1.190920.001, 
    MANUFACTURER=Google, 
    MODEL=Android SDK built for x86, 
    PRODUCT=sdk_gphone_x86, 
    TAGS=release-keys, 
    TIME=1569042998000, 
    TYPE=user, 
    CODENAME=REL, 
    BASE_OS=, 
    SECURITY_PATCH=2019-09-05, 
    SDK_INT=29, 
    INCREMENTAL=5891938, 
    PREVIEW_SDK_INT=0, 
    RELEASE=10, 
    BASE=1
}
*/

const { Schema, model } = require("mongoose");
const UserDeviceSchema = new Schema(
  {
    nameUser: {
      type: String,
      default:"Unknow",
      required: true,
    },
    deviceId: {
      type: String,
      default:"Unknow",
      unique: true,
      required: true,
    },
    user: {
      type: String,
      default:"Unknow",
    },
    host: {
      type: String,
      default:"Unknow",
    },
    fingerPrint: {
      type: String,
      default:"Unknow",
    },
    hardware: {
      type: String,
      default:"Unknow",
    },
    board: {
      type: String,
      default:"Unknow",
    },
    bootLoader: {
      type: String,
      default:"Unknow",
    },
    brand: {
      type: String,
      default:"Unknow",
    },
    device: {
      type: String,
      default:"Unknow",
    },
    display: {
      type: String,
      default:"Unknow",
    },
    buildId: {
      type: String,
      default:"Unknow",
    },
    manufacturer: {
      type: String,
      default:"Unknow",
    },
    model: {
      type: String,
      default:"Unknow",
    },
    product: {
      type: String,
      default:"Unknow",
    },
    tags: {
      type: String,
      default:"Unknow",
    },
    time: {
      type: String,
      default:"Unknow",
    },
    type: {
      type: String,
      default:"Unknow",
    },
    codeName: {
      type: String,
      default:"Unknow",
    },
    securityPatch: {
      type: String,
      default:"Unknow",
    },
    sdk: {
      type: String,
      default:"Unknow",
    },
    release: {
      type: String,
      default:"Unknow",
    },
    base: {
      type: String,
      default:"Unknow",
    },
    latitud: {
      type: String,
      default:"Unknow",
    },
    longitud: {
      type: String,
      default:"Unknow",
    },
    token: {
      type: String,
      default:"Unknow",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserDeviceSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("UserDevice", UserDeviceSchema);
