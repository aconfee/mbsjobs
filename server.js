var express = require("express"),
    app     = express(),

    // Extra tools
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),

    // Server side controllers
    JobSearchController = require("./server/controllers/JobSearchController");

// Initialize db
mongoose.connect("mongodb://aconfee:password@ds011419.mlab.com:11419/mbsjobs");
//mongoose.connect("mongodb://localhost:27017/mean-demo");

app.get("/", function(req, res){
  res.sendfile(__dirname + "/client/views/index.html");
});

// Define middleware
app.use(bodyParser());

// Define public static content to serve.
app.use("/js", express.static(__dirname + "/client/js"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));

// REST API
app.post("/api/jobsearch", JobSearchController.search);
app.get("/api/jobsearch", JobSearchController.searchList);

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("I'm listening on port " + port + "...");
});
