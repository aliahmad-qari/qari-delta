const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/Listing.js");
const { object } = require("joi");

let Mon_URL = "mongodb://127.0.0.1:27017/wonderlast";
main()
  .then((res) => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
async function main() {
  await mongoose.connect(Mon_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  let initializedData = initData.data.map((obj) => ({
    ...obj,
    owner: "67bff1af796d923db965441c",
  }));
  await Listing.insertMany(initializedData); // Updated to use initializedData
  console.log("Data imported successfully");
};

initDB();
