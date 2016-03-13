var express = require("express"),
    app     = express(),

    // Extra tools
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),

    // Server side controllers
    JobSearchController = require("./server/controllers/JobSearchController");

// Initialize db
mongoose.connect("mongodb://localhost:27017/mean-demo");

app.get("/", function(req, res){
  res.sendfile(__dirname + "/client/views/index.html");
});

// Define middleware
app.use(bodyParser());

// Define public static content to serve.
app.use("/js", express.static(__dirname + "/client/js"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));

// REST API
app.post("/api/jobs", JobSearchController.search);

//app.post("/api/meetups", meetupsController.create);
//app.get("/api/meetups", meetupsController.list);

app.listen(3000, function(){
  console.log("I'm listening...");
});
