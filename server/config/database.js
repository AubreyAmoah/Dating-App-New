const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config({ path: './.env'});

// const { MONGO_URI } = process.env;
const MONGO_URI = process.env.DB_URL

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};