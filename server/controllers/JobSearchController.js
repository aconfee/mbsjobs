
module.exports.search = function(req, res){
  // Relay client information back to us.
  res.json({
    "host": req.headers.host,
    "userAgent": req.headers["user-agent"]
  });
};

/*
var Meetup = require("../models/meetup");

module.exports.create = function(req, res){
  var meetup = new Meetup(req.body);
  meetup.save(function(err, result){
    res.json(result);
  });
};

module.exports.list = function(req, res){
  Meetup.find({}, function(err, results){
    res.json(results);
  });
};
*/
