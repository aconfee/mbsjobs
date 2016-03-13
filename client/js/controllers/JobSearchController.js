app_mbsjobs.controller("JobSearchController", ["$scope", "$resource", "$http", function($scope, $resource, $http){

  // API with our server to send search records.
  var JobSearch = $resource("/api/jobs");
  var self = this;

  $scope.jobResults = [
    { "name": "Super awesome job" },
    { "name": "Super shitty job" },
    { "name": "Best job you ever had" }
  ];

  $scope.searchJobs = function(){

    // Send the job search data to the server to store in our records.
    var search = new JobSearch();
    search.searchPhrase = $scope.searchPhrase;
    search.zipcode = $scope.zipcode;
    search.$save(function(result){
      self.userIp = result.host;
      self.userAgent = result.userAgent;

      console.log(self.userIp);
      console.log(self.userAgent);

      // MUST HAVE HTTP REQUEST HERE TO ENSURE VALID USERIP AND USERAGENT!
    });

    // Search for jobs and display on the page.
    $http({
      method: "GET",
      url: "//api.indeed.com/ads/apisearch?publisher=2878037053725137&v=2&format=json&userip=192.168.1.3&useragent=Mozilla/%2F4.0%28Firefox%29",
      headers: {
        "Content-Type": "application/javascript;charset=UTF-8"
      }
      /*
      url: "http://api.indeed.com/ads/apisearch",
      params: {
        publisher: "2878037053725137",
        v: "2",
        format: "json"
      }
      */
      /*
      url: "http://jsonplaceholder.typicode.com/posts/1",
      params: {
        userId: "1"
      }
      */
    }).then(function(response) {
        console.log("success");
        console.log(response);
        console.log(response.data);
      }, function(response) {
        console.log("error");
        console.log(response);
        console.log(response.message);
        console.log(response.filename);
    });
  };

/*
    var Meetup = $resource("/api/meetups");

    Meetup.query(function(results){
      $scope.meetups = results;
    });

    $scope.meetups = [];

    $scope.createMeetup = function(){
      var meetup = new Meetup();
      meetup.name = $scope.meetupName;
      meetup.$save(function(result){
        $scope.meetups.push(result);
        $scope.meetupName = "";
      });
    };
    */

}]);
