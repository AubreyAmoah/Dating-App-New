const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
   token: {type : String, default: ""},
   user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'}
});

module.exports = mongoose.model("token", tokenSchema);