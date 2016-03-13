var mongoose = require("mongoose");

module.exports= mongoose.model("SearchRecord", {
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
  searchPhrase: { type: String, required: true },
  zipcode: { type: String, required: true },
  queryDate: { type: Date, required: true }
});
