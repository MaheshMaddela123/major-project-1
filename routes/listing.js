const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../Utils/wrapAsync.js");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedin,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createList)
  );
//New Route
router.get("/new", isLoggedin, listingController.newListing);

router
  .route("/:id")
  //Show Route
  .get(wrapAsync(listingController.showListing))
  //update Route
  .put(
    isLoggedin,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  //Delete Route
  .delete(isLoggedin, isOwner, wrapAsync(listingController.deleteListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedin,
  isOwner,
  wrapAsync(listingController.editLising)
);

module.exports = router;
