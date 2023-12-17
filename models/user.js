const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    user_name: {
      type: String,
      unique: true,
    },
    user_email: {
      type: String,
      unique: true,
    },
    user_password: {
      type: String,
    },
    user_info: {
      type: String,
    },
    user_photo: {
      type: String,
    },
    created_date: {
      type: String,
    },
    updated_date: {
      type: String,
    },
    user_is_active: {
      type: Boolean,
      default: false,
    },
    user_activation_link: {
      type: String,
    },
  },
  {
    versionKey: false,
  }
);
module.exports = model("User", userSchema);
