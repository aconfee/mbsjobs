var express = require("express"),
    app     = express(),

    // Extra tools
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),

    // Server side controllers
    JobSearchController = require("./server/controllers/JobSearchController"),
    AdminController = require("./server/controllers/AdminController");

// Initialize db
mongoose.connect("mongodb://aconfee:password@ds011419.mlab.com:11419/mbsjobs");

// Define middleware
app.use(bodyParser());

var logger = function(req, res, next){
  console.log(req.url);
  next();
};
//app.use(logger);

// Horribly basic authentication.
var basicAuth = require('basic-auth');
var myBasicAuth = function(username, password) {
  return function(req, res, next) {
    var user = basicAuth(req);

    if (!user || user.name !== username || user.pass !== password) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.send(401);
    }
    next();
  };
};

// Define page routes
app.get("/", function(req, res){
  res.sendFile(__dirname + "/client/views/index.html");
});

app.get("/admin", myBasicAuth('adam', 'secret'), function(req, res){
  res.sendFile(__dirname + "/client/views/admin.html");
});

// Define public static content to serve.
app.use("/js", express.static(__dirname + "/client/js"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));

// REST API
app.post("/api/jobsearch", JobSearchController.search);
app.get("/api/jobsearch", JobSearchController.searchRecords);
app.post("/api/tracking", AdminController.createTrackingCode);

// Initialize server.
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("I'm listening on port " + port + "...");
});
