const { Schema, model } = require("mongoose");
const AdminSchema = new Schema(
  {
    email: {
      type: String,
      default: "Unknow",
      required: true,
    },
    verification: {
      type: Boolean,
      default: "Unknow",
      required: true,
    },
    name: {
      type: String,
      default: "Unknow",
    },
    nickname: {
      type: String,
      default: "Unknow",
    },
    picture: {
      type: String,
      default: "Unknow",
    },
    sub: {
      type: String,
      default: "Unknow",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

AdminSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("AdminSchema", AdminSchema);
