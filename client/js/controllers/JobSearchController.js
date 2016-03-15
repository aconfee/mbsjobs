app_mbsjobs.controller("JobSearchController", ["$scope", "$http", "$sce", function($scope, $http, $sce){

  // 'Private' controller variables.
  var self = this;
  self.maxRecords = 10;
  self.maxResults = 10;
  self.userIp = "";
  self.userAgent = "";

  // Binding variables.
  $scope.searchMessage = "Please search to display jobs.";
  $scope.recordsPageNumber = 0;
  $scope.resultsPageNumber = 0;
  //$scope.searchRecords = [];
  //$scope.jobResults = [];
  $scope.zipcode; // used by form
  $scope.searchPhrase; // used by form

  ///
  /// Post a job search.
  ///
  $scope.searchJobs = function(){
    if($scope.searchPhrase === undefined || $scope.zipcode === undefined){
      $scope.searchMessage = "Please enter a search phrase and location.";
      return;
    }

    // Save the search data.
    $http.post("/api/jobsearch", {searchPhrase: $scope.searchPhrase, zipcode: $scope.zipcode})
      // Query for jobs once we have ip and useragent info.
      .then(function(response) {
        // Save ip and agent detected and returned from server.
        self.userIp = response.data.ipAddress;
        self.userAgent = response.data.userAgent;

        if(self.userIp === undefined || self.userAgent === undefined)
          console.error("Client IP or agent is not defined.");

        // Query Indeed for jobs.
        self.queryJobs(
          function(response){ // Success
            if(response.results.length === 0){
              $scope.searchMessage = "Sorry. No results found.";
              return;
            }

            $scope.searchMessage = response.totalResults + " results found.";
            $scope.jobResults = response.results;
            $scope.$apply();
          },
          function(response){ // Error
            console.log("ERROR querying jobs in searchJobs.");
        }); // query jobs
        }, function(response) {
          console.log("ERROR getting search records.");
    });
  }; // search jobs

  ///
  /// Create a valid job link from a resulting job. Can bind to HTML.
  ///
  $scope.createJobLinkFromJob = function(job){
      var jobLink = "<a onmousedown=\"" + job.onmousedown + "\" href=\"" + job.url + "\" target=\"_blank\">" + job.jobtitle + "</a>";
      return $sce.trustAsHtml(jobLink);
  };

  ///
  /// Get the saved job search records.
  ///
  $scope.getSearchRecords = function(){
    $http({
      method: "GET",
      url: "/api/jobsearch",
      params: {
        start: $scope.recordsPageNumber * self.maxRecords,
        limit: self.maxRecords
      }
    }).then(
      function(response) {
        $scope.searchRecords = response.data;
        $scope.$apply();
      }, function(response) {
        console.log("ERROR getting search records.");
    });
  };

  ///
  /// Modify the page we're on and search for search records.
  ///
  $scope.previousRecords = function(){
    if($scope.recordsPageNumber === 0) return;

    $scope.recordsPageNumber -= 1;
    $scope.getSearchRecords();
  };

  $scope.nextRecords = function(){
    if($scope.searchRecords.length != self.maxRecords) return;

    $scope.recordsPageNumber += 1;
    $scope.getSearchRecords();
  };

  ///
  /// Modify the page we're on and search for jobs.
  ///
  $scope.previousResults = function(){
    if($scope.resultsPageNumber === 0) return;

    $scope.resultsPageNumber -= 1;

    // Query Indeed for jobs without saving the search result.
    self.queryJobs(
      function(response){ // Success
        $scope.jobResults = response.results;
        $scope.$apply();
      },
      function(response){ // Error
        console.log("ERROR querying jobs in previous results.");
    }); // query jobs
  };

  $scope.nextResults = function(){
    if($scope.jobResults.length != self.maxResults) return;

    $scope.resultsPageNumber += 1;

    // Query Indeed for jobs without saving the search result.
    self.queryJobs(
      function(response){ // Success
        $scope.jobResults = response.results;
        $scope.$apply();
      },
      function(response){ // Error
        console.log("ERROR querying jobs in next results.");
    }); // query jobs
  };

  ///
  /// Query Indeed jobs API.
  ///
  self.queryJobs = function(successCb, errorCb){
    if(self.userIp === "" ||
        self.userAgent === "" ||
        $scope.zipcode === undefined ||
        $scope.searchPhrase === undefined)
    {
      console.error("Bad parameters, cannot query jobs.");
      return;
    }

    var jobSearchUrl = "http://api.indeed.com/ads/apisearch?publisher=2878037053725137&chnl=FJR&v=2&format=json" +
      "&userip=" + self.userIp +
      "&useragent=" + self.userAgent +
      "&l=" + $scope.zipcode +
      "&q=" + $scope.searchPhrase +
      "&limit=" + self.maxResults +
      "&start=" + ($scope.resultsPageNumber * self.maxResults);

    $.ajax({
      method: "GET",
      url: jobSearchUrl,
      dataType: "jsonp"
    })
    .done(function(data){successCb(data);})
    .fail(function(){errorCb(data);});
  }; // query jobs
}]); // controller
