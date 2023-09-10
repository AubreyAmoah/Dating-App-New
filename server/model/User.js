const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: [true,'Please provide firstname'], default: null },
    last_name: { type: String, required: [true,'Please provide lastname'], default: null },
    email: { type: String, required: [true,'Please provide email'], unique: true },
    gender: {type: String, default: null},
    university: {type: String, default: null},
    level: {type: String, default: null},
    dob: {type: Date, required: [true,'Please provide dob']},
    profile_pic: {type:String, default: null},
    activated: {type:Boolean, default:"no"},
    pending: [{type : String, default: ""}],
    matches: [{type : String, default: ""}],
    password: { type: String },
});

module.exports = mongoose.model("user", userSchema);