const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.newListing = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "This list is no longer exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createList = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Added!");
  res.redirect("/listings");
};

module.exports.editLising = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  req.flash("success", "Listing Updated!");
  if (!listing) {
    req.flash("error", "This list is no longer exist!");
    res.redirect("/listings");
  }
  let originalImg = listing.image.url;
  originalImg = originalImg.replace("/upload", "/upload/h_200,w_250");
  res.render("listings/edit.ejs", { listing, originalImg });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deleteList = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
