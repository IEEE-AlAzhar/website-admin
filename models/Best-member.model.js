const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const BestMemberSchema = new Schema({
  name: {
    type: String,
    required: [true, "Username is required!"],
  },
  image: {
    type: String,
    required: [true, "User type is required!"],
  },
  committee: {
    type: String,
    required: [true, "user committee is required!"],
  },
});

const BestMember = mongoose.model("BestMember", BestMemberSchema);
module.exports = BestMember;
