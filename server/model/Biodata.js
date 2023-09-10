const mongoose = require("mongoose");

const bioDataSchema = new mongoose.Schema({
   images: [{ type : String, default: ""}],
   campus: [{type : String, default: ""}],
   gender_interest: [{type : String, default: ""}],
   level_interest: [{type : String, default: ""}],
   interest: [{type : String, default: ""}],
   description: {type : String, default: ""},
   user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'}
});

module.exports = mongoose.model("bioData", bioDataSchema);