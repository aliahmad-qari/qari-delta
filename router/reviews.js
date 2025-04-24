const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');

const Listing= require('../models/Listing.js');
const Review = require("../models/review.js");
const {validateReview, isLoggedIn,isReviewAuthor} = require('../middleware.js');
const ReviewController = require('../controllers/review.js');




router.post("/allList/:id/review",isLoggedIn, validateReview, wrapAsync(ReviewController.createReview));
  
router.delete("/allList/:id/review/:reviewId", isLoggedIn,isReviewAuthor, wrapAsync(ReviewController.deleteReview));


// Exporting the router
module.exports = router;
