var SearchRecord = require("../models/searchRecord");

// Save the search info and respond with client information needed for Indeed API call.
module.exports.search = function(req, res){
  // Store the search term in our records.
  var searchRecord = new SearchRecord({
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
    searchPhrase: req.body.searchPhrase,
    zipcode: req.body.zipcode,
    queryDate: Date()
  });

  searchRecord.save(function(err, result){
    if(err) console.log(err);
    
    res.json(result);
  });
};

// Get all search records.
module.exports.searchRecords = function(req, res){
  SearchRecord.find({})
    .skip(req.query.start)
    .limit(req.query.limit)
    .sort("-queryDate")
    .exec(function(err, results){
      if(err) console.log(err);

      res.json(results);
    });
};
