const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  location: String,
  country: String,
  image: {
    url: String,
    filename: String,
  },
  geometry: {
    type: {
      type: String, // Must be "Point"
      enum: ["Point"], // GeoJSON requires "Point"
      required: true,
    },
    coordinates: {
      type: [Number], // Array of numbers: [longitude, latitude]
      required: true,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  category:{
    type: String,
    enum: ["Trending", "Rooms", "Iconic city","Mountains","Castles","Beach","Arctic","Farms","Nature","Camping","Dome","Boat"],
    
  }
});

module.exports = mongoose.model("Listing", listingSchema);