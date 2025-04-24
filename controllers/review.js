const Listing = require("../models/Listing.js");
const Review = require("../models/review.js");   
   
   
   module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", " new review created  successfully");
  res.redirect(`/allList/${req.params.id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    return res.status(404).send("Listing not found.");
  }

  await Listing.findByIdAndUpdate(
    id,
    { $pull: { reviews: reviewId } },
    { new: true }
  );
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", " review deleted successfully");

  res.redirect(`/allList/${id}`);
};
