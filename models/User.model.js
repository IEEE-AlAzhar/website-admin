const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required!"],
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
  },
  type: {
    type: String,
    required: [true, "User type is required!"],
  },
  committee: {
    type: String,
    required: [true, "user committee is required!"],
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
