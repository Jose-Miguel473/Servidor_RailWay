/*    
    -------------------------
    Number: ${valueCallLog["number"]}
    Name: ${valueCallLog["name"]}
    Duration: ${valueCallLog["duration"]}
    TypeRaw: ${valueCallLog["typeRaw"]}
    Type: ${valueCallLog["type"]}
    Date: ${valueCallLog["date"]}
    -------------------------
*/

const { Schema, model } = require("mongoose");
const CallLogSchema = new Schema(
  {
    number: {
      type: String,
      // unique: false,
      required: true,
    },
    nameContact: {
      type: String,
      default: "Unknow",
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    typeRaw: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
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

CallLogSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("CallLog", CallLogSchema);
