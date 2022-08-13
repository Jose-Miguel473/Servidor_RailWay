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
      unique: true,
      require: true,
    },
    nameContact: {
      type: String,
      default: "Unknow",
      require: true,
    },
    duration: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      require: true,
    },
    typeRaw: {
      type: String,
      require: true,
    },
    date: {
      type: String,
      require: true,
    },
    userDevice: {
        type: Schema.Types.ObjectId,
        ref: 'UserDevice',
        required: true
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
