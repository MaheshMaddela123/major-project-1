const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../Utils/wrapAsync.js");
const {
  validateReview,
  isLoggedin,
  isReviewAuthor,
} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//Review POST

router.post(
  "/",
  isLoggedin,
  validateReview,
  wrapAsync(reviewController.addReview)
);

//Review Delete
router.delete(
  "/:reviewId",
  isLoggedin,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
