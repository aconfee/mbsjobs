var fs = require("fs");

// Save the search info and respond with client information needed for Indeed API call.
module.exports.createTrackingCode = function(req, res){
  fs.writeFile(__dirname + "/../../client/js/tracking.js", req.body.trackingCode,  function(err) {
     if (err) {
         return console.error(err);
     }
  });

  res.end("Success.");
};
