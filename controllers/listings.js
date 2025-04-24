const Listing = require("../models/Listing.js");
const { validateListing } = require("../middleware.js");
const ExpressError = require("../utils/ExpressError.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const filter = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.location) {
    filter.location = { $regex: req.query.location, $options: "i" };
  }
  if (req.query.country) {
    filter.country = req.query.country;
  }
  const allListings = await Listing.find(filter).populate({
    path: "reviews",
    populate: {
      path: "author",
    },
  });
  res.render("listings/index", { allListings });
};

module.exports.renderNewform = async (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "The list you want to access does not exist.");
    return res.redirect("/allList");
  }

  res.render("./listings/show.ejs", { listing });
};

module.exports.createNewListing = async (req, res, next) => {
  try {
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    console.log("Geocoding Response:", response.body); // Debugging

    const geoData = response.body.features[0].geometry;

    if (!geoData || !geoData.coordinates || geoData.coordinates.length !== 2) {
      throw new ExpressError(400, "Invalid coordinates received from Geocoding API");
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    newListing.geometry = {
      type: "Point",
      coordinates: geoData.coordinates, // Ensure this is [longitude, latitude]
    };

    let savedListing = await newListing.save();
    console.log("Saved Listing:", savedListing); // Debugging

    req.flash("success", "New listing created successfully!");
    res.redirect(`/allList/${newListing._id}`);
  } catch (err) {
    console.error("Error creating listing:", err);
    next(err);
  }
};

module.exports.updateListing = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save();
  }
  
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/allList/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findOneAndDelete({ _id: id });
  req.flash("success", "Listing deleted successfully");
  res.redirect("/allList");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "The list you want to edit does not exist.");
    return res.redirect("/allList");
  }
  res.render("listings/edit.ejs", { listing });
};
