const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const ExpressError = require("../utils/ExpressError.js");

// Middleware to parse form data
router.use(express.urlencoded({ extended: true }));
router.use(express.json()); // Ensure JSON data is parsed if sent

// Updated route to ensure proper middleware order
router
  .route("/allList")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    (req, res, next) => {
      try {
        console.log("Request body:", req.body);
        console.log("Uploaded file:", req.file);

        // Ensure proper data structure
        if (!req.body.listing) {
          if (req.body.title && req.body.description) {
            // Handle case where data isn't nested under 'listing'
            req.body = { listing: req.body };
          } else {
            console.error("Invalid listing data structure");
            return next(new ExpressError(400, "Invalid listing data format"));
          }
        }
        next();
      } catch (err) {
        console.error("Error processing listing data:", err);
        next(new ExpressError(500, "Error processing request"));
      }
    },
    validateListing,
    wrapAsync(listingController.createNewListing)
  );

router.get(
  "/allList/new",
  isLoggedIn,
  wrapAsync(listingController.renderNewform)
);

router
  .route("/allList/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    (req, res, next) => {
      if (!req.body.listing) {
        req.body = { listing: req.body };
      }
      next();
    },
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

router.get(
  "/allList/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
