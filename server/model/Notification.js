const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
   notification: { type : String, default: ""},
   time_added: {type : Date, default: mongoose.now},
   user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'}
});

module.exports = mongoose.model("notification", notificationSchema);