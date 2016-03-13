
var SearchRecord = require("../models/searchRecord");

// Save the search info and respond with client information needed for Indeed API call.
module.exports.search = function(req, res){
  // Store the search term in our records.
  var searchRecord = new SearchRecord({
    ipAddress: req.headers.host,
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
module.exports.searchList = function(req, res){
  SearchRecord.find({}, function(err, results){
    res.json(results);
  });
};
