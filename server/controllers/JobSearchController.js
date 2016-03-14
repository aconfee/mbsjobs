
var SearchRecord = require("../models/searchRecord");

// Save the search info and respond with client information needed for Indeed API call.
module.exports.search = function(req, res){
  console.log("client ip: " + req.ip);
  console.log("client ip: " + req.headers["x-forwarded-for"]);
  console.log("client ip: " + req.connection.remoteAddress);
  console.log("client ip: " + req.ip);
  // Store the search term in our records.
  var searchRecord = new SearchRecord({
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
    searchPhrase: req.body.searchPhrase,
    zipcode: req.body.zipcode,
    queryDate: Date()
  });

  searchRecord.save(function(err, result){
    console.log("Search saved.");
    console.log("error: " + err);
    res.json(result);
  });
};

// Get all search records.
module.exports.searchRecords = function(req, res){
  var numSkip = req.query.page * 5; // Pages times max results per page.
  console.log("skipping results: " + numSkip);

  SearchRecord.find({ queryDate: { $lte: Date() }})
    .skip(numSkip)
    .limit(5)
    .sort("-queryDate")
    .exec(function(err, results){
      console.log("queried for records");
      res.json(results);
    });
};
