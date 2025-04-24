const Listing = require("./models/Listing.js");
const ExpressError = require("./utils/ExpressError.js");


const { listingSchema } = require("./Schema.js");
const Review = require("./models/review.js");


module.exports.isLoggedIn = (req, res, next) => {
  console.log("Checking if user is logged in..."); // Debugging statement

  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;

    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirect = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing.owner._id.equals(req.user._id)) {
    req.flash("error", " sorry,You are not the owner of this listing");
    return res.redirect(`/allList/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  // Create a clean copy of the request body without _method
  const bodyCopy = { ...req.body };
  delete bodyCopy._method;

  // Ensure data is properly nested under 'listing' key before validation
  if (!bodyCopy.listing) {
    bodyCopy.listing = bodyCopy;
  }

  const { error } = listingSchema.validate(bodyCopy);

  console.log("Validation result:", error); // Debugging statement for validation

  if (error) {
    console.error("Validation error:", error.details);
    throw new ExpressError(error.details.map((err) => err.message).join(", "));
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { comment, rating } = req.body.review;

  // Check if comments are provided
  if (!comment || typeof comment !== 'string' || comment.trim() === '') {
    throw new ExpressError(400, "Comments are required and must be a non-empty string.");
  }

  // Check if rating is a number between 1 and 5
  if (typeof rating !== 'number' && isNaN(rating) || rating < 1 || rating > 5) {
    throw new ExpressError(400, "Rating must be a number between 1 and 5.");
  }

  next();
};


module.exports.isReviewAuthor = async (req, res, next) => {
  let { id,reviewId } = req.params;
  let review = await Review.findById(reviewId);

  if (!review.author._id.equals(req.user._id)) {
    req.flash("error", " sorry,You are not the owner of this listing");
    return res.redirect(`/allList/${id}`);
  }
  next();
};
