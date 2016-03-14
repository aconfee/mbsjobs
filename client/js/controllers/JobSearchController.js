app_mbsjobs.controller("JobSearchController", ["$scope", "$resource", "$http", "$sce", function($scope, $resource, $http, $sce){

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
  $scope.searchRecords = [];
  $scope.jobResults = [];
  $scope.zipcode; // used by form
  $scope.searchPhrase; // used by form
  $scope.currentMousedownCode;

  // API with our server to send search records.
  var JobSearch = $resource("/api/jobsearch");

  ///
  /// Post a job search.
  ///
  $scope.searchJobs = function(){
    if($scope.searchPhrase === undefined || $scope.zipcode === undefined){
      $scope.searchMessage = "Please enter a search phrase and location.";
      return;
    }

    // Save the search data.
    var search = new JobSearch();
    search.searchPhrase = $scope.searchPhrase;
    search.zipcode = $scope.zipcode;
    search.$save(function(result){
      // Save ip and agent detected and returned from server.
      self.userIp = result.ipAddress;
      self.userAgent = result.userAgent;

      /// TEMPORARY HACK UNTIL API CALL IS FIXED!!!!
      if(mockresult.results.length > 0)
        $scope.currentMousedownCode = mockresult.results[0].onmousedown;
      $scope.jobResults = mockresult.results;
      ///

      // Query Indeed for jobs.
      self.queryJobs(
        function(response){ // Success
          if(response.results.length === 0){
            $scope.searchMessage = "Sorry. No results found.";
            return;
          }

          $scope.searchMessage = response.totalResults + " results found.";
          $scope.jobResults = response.results;
        },
        function(response){ // Error
          console.log("ERROR querying jobs in searchJobs.");
      }); // query jobs
    }); // save search data
  }; // search jobs

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
      }, function(response) {
        console.log("ERROR getting search records.");
    });
  };

  ///
  /// Modify the page we're on and search for records.
  ///
  $scope.previousRecords = function(){
    if($scope.recordsPageNumber === 0) return;

    $scope.recordsPageNumber -= 1;
    $scope.getSearchRecords();
  }

  $scope.nextRecords = function(){
    if($scope.searchRecords.length != self.maxRecords) return;

    $scope.recordsPageNumber += 1;
    $scope.getSearchRecords();
  }

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
      },
      function(response){ // Error
        console.log("ERROR querying jobs in previous results.");
    }); // query jobs
  }

  $scope.nextResults = function(){
    if($scope.jobResults.length != self.maxResults) return;

    $scope.resultsPageNumber += 1;

    // Query Indeed for jobs without saving the search result.
    self.queryJobs(
      function(response){ // Success
        $scope.jobResults = response.results;
      },
      function(response){ // Error
        console.log("ERROR querying jobs in next results.");
    }); // query jobs
  }

    ///
    /// Query Indeed jobs API.
    ///
    self.queryJobs = function(successCb, errorCb){
      if(self.userIp === "" ||
          self.userAgent === "" ||
          $scope.zipcode === undefined ||
          $scope.searchPhrase === undefined)
      {
        console.log("Bad parameters, cannot query jobs.");
        return;
      }

      $http({
        method: "GET",
        url: "http://api.indeed.com/ads/apisearch",
        params: {
          publisher: "2878037053725137",
          v: "2",
          format: "json",
          userip: self.userIp,
          useragent: self.userAgent,
          l: $scope.zipcode,
          q: $scope.searchPhrase,
          chnl: "FJR",
          limit: self.maxResults,
          start: $scope.resultsPageNumber * self.maxResults
        },
        headers: {
          "Content-Type": "application/javascript;charset=UTF-8"
        }
      }).then(
        function(response) {
          if(response.results.length > 0)
            $scope.currentMousedownCode = response.results[0].onmousedown;

          successCb(response);
        },
        function(response) {
          errorCb(response);
      });
    }; // query jobs


    /// HACK MOCK DATA UNTIL API CALL IS FIXED.
    var mockresult = {
        "version" : 2,
        "query" : "c++ developer",
        "location" : "98004",
        "dupefilter" : true,
        "highlight" : true,
        "radius" : 25,
        "start" : 1,
        "end" : 10,
        "totalResults" : 865,
        "pageNumber" : 0,
        "results" : [
          {
              "jobtitle" : "Software Engineer",
              "company" : "Microsoft",
              "city" : "Bellevue",
              "state" : "WA",
              "country" : "US",
              "formattedLocation" : "Bellevue, WA",
              "source" : "Microsoft",
              "date" : "Sun, 13 Mar 2016 03:35:35 GMT",
              "snippet" : "1+ years of relevant software design and development in <b>C++</b>, C#, Java, HTML/JS. This is a high-visibility role for a <b>developer</b> who is comfortable dealing with...",
              "url" : "http://www.indeed.com/viewjob?jk=698c3f140534b10a&qd=-mW6xvOQ2igwj_Iu4z5QhD5-3lOQSa-noddW6o1Y0cWdrLMf2Pdu_NmAp10NXSzl6CYW7b8moy96aNz9dmbHHQYbF369NApnVHByyDVOuXQ40X9RqMmoWy146cYiCabl&indpubnum=2878037053725137&atk=1ados92u2bq4udbm",
              "onmousedown" : "indeed_clk(this, '9537');",
              "jobkey" : "698c3f140534b10a",
              "sponsored" : false,
              "expired" : false,
              "indeedApply" : false,
              "formattedLocationFull" : "Bellevue, WA",
              "formattedRelativeTime" : "17 hours ago",
              "noUniqueUrl" : false
          },
          {
              "jobtitle" : "Software Engineer II - Cloud and Enterprise",
              "company" : "Microsoft",
              "city" : "Redmond",
              "state" : "WA",
              "country" : "US",
              "formattedLocation" : "Redmond, WA",
              "source" : "Microsoft",
              "date" : "Fri, 18 Dec 2015 10:24:04 GMT",
              "snippet" : "C, <b>C++</b>, C#, Java. Our team fosters a supportive and productive work environment and is known for providing growth avenues for <b>developers</b> to reach the highest...",
              "url" : "http://www.indeed.com/viewjob?jk=6e5246e0bfa347f7&qd=-mW6xvOQ2igwj_Iu4z5QhD5-3lOQSa-noddW6o1Y0cWdrLMf2Pdu_NmAp10NXSzl6CYW7b8moy96aNz9dmbHHQYbF369NApnVHByyDVOuXQ40X9RqMmoWy146cYiCabl&indpubnum=2878037053725137&atk=1ados92u2bq4udbm",
              "onmousedown" : "indeed_clk(this, '9537');",
              "jobkey" : "6e5246e0bfa347f7",
              "sponsored" : false,
              "expired" : false,
              "indeedApply" : false,
              "formattedLocationFull" : "Redmond, WA 98052",
              "formattedRelativeTime" : "30+ days ago",
              "noUniqueUrl" : false
          },
          {
              "jobtitle" : "C++ Developer",
              "company" : "American IT Resource Group Inc",
              "city" : "Redmond",
              "state" : "WA",
              "country" : "US",
              "formattedLocation" : "Redmond, WA",
              "source" : "Indeed",
              "date" : "Tue, 08 Mar 2016 16:42:55 GMT",
              "snippet" : "* C++ ( *must* ), Win 32 App / Windows SDK, Windows RT ( *must* ) * Windows store dev experience ( *must* ) * XAML Good to Have Skills: * C#.Net * PowerShell...",
              "url" : "http://www.indeed.com/viewjob?jk=e698e5c20ec7abc3&qd=-mW6xvOQ2igwj_Iu4z5QhD5-3lOQSa-noddW6o1Y0cWdrLMf2Pdu_NmAp10NXSzl6CYW7b8moy96aNz9dmbHHQYbF369NApnVHByyDVOuXQ40X9RqMmoWy146cYiCabl&indpubnum=2878037053725137&atk=1ados92u2bq4udbm",
              "onmousedown" : "indeed_clk(this, '9537');",
              "jobkey" : "e698e5c20ec7abc3",
              "sponsored" : false,
              "expired" : false,
              "indeedApply" : true,
              "formattedLocationFull" : "Redmond, WA",
              "formattedRelativeTime" : "5 days ago",
              "noUniqueUrl" : true
          },
          {
              "jobtitle" : "Tools Programmer",
              "company" : "NCsoft Corporation",
              "city" : "Bellevue",
              "state" : "WA",
              "country" : "US",
              "formattedLocation" : "Bellevue, WA",
              "source" : "NCsoft Corporation",
              "date" : "Tue, 23 Feb 2016 21:48:13 GMT",
              "snippet" : "5 years software development experience with C# and <b>C++</b>. You'll be writing C# and <b>C++</b> code to provide a flexible toolchain that other <b>developers</b> can easily...",
              "url" : "http://www.indeed.com/viewjob?jk=3db9e291348fbf57&qd=-mW6xvOQ2igwj_Iu4z5QhD5-3lOQSa-noddW6o1Y0cWdrLMf2Pdu_NmAp10NXSzl6CYW7b8moy96aNz9dmbHHQYbF369NApnVHByyDVOuXQ40X9RqMmoWy146cYiCabl&indpubnum=2878037053725137&atk=1ados92u2bq4udbm",
              "onmousedown" : "indeed_clk(this, '9537');",
              "jobkey" : "3db9e291348fbf57",
              "sponsored" : false,
              "expired" : false,
              "indeedApply" : false,
              "formattedLocationFull" : "Bellevue, WA",
              "formattedRelativeTime" : "18 days ago",
              "noUniqueUrl" : false
          },
          {
              "jobtitle" : "Software Development Engineer I (Mobile)",
              "company" : "Egencia",
              "city" : "Bellevue",
              "state" : "WA",
              "country" : "US",
              "formattedLocation" : "Bellevue, WA",
              "source" : "Expedia",
              "date" : "Sat, 12 Mar 2016 02:53:02 GMT",
              "snippet" : "1-3 years development experience in Objective-C, Java, <b>C++</b> or other object oriented programming language....",
              "url" : "http://www.indeed.com/viewjob?jk=cc50534da8d3f155&qd=-mW6xvOQ2igwj_Iu4z5QhD5-3lOQSa-noddW6o1Y0cWdrLMf2Pdu_NmAp10NXSzl6CYW7b8moy96aNz9dmbHHQYbF369NApnVHByyDVOuXQ40X9RqMmoWy146cYiCabl&indpubnum=2878037053725137&atk=1ados92u2bq4udbm",
              "onmousedown" : "indeed_clk(this, '9537');",
              "jobkey" : "cc50534da8d3f155",
              "sponsored" : false,
              "expired" : false,
              "indeedApply" : false,
              "formattedLocationFull" : "Bellevue, WA",
              "formattedRelativeTime" : "1 day ago",
              "noUniqueUrl" : false
          },
          {
              "jobtitle" : "C++, C#, Java Developer - Web UI / Data Aggregation",
              "company" : "CompuCom ITWS",
              "city" : "Redmond",
              "state" : "WA",
              "country" : "US",
              "formattedLocation" : "Redmond, WA",
              "source" : "CompuCom ITWS",
              "date" : "Tue, 23 Feb 2016 03:19:44 GMT",
              "snippet" : "C#, Java, <b>C++</b>, VSO, GIT, Azure services, web development, data mining. Our high-visibility client is seeking a <b>Developer</b> who can build a web-based proof of...",
              "url" : "http://www.indeed.com/viewjob?jk=ac8cf505fc9cb310&qd=-mW6xvOQ2igwj_Iu4z5QhD5-3lOQSa-noddW6o1Y0cWdrLMf2Pdu_NmAp10NXSzl6CYW7b8moy96aNz9dmbHHQYbF369NApnVHByyDVOuXQ40X9RqMmoWy146cYiCabl&indpubnum=2878037053725137&atk=1ados92u2bq4udbm",
              "onmousedown" : "indeed_clk(this, '9537');",
              "jobkey" : "ac8cf505fc9cb310",
              "sponsored" : false,
              "expired" : false,
              "indeedApply" : false,
              "formattedLocationFull" : "Redmond, WA",
              "formattedRelativeTime" : "19 days ago",
              "noUniqueUrl" : false
          },
          {
              "jobtitle" : "Tools Programmer",
              "company" : "ArenaNet",
              "city" : "Bellevue",
              "state" : "WA",
              "country" : "US",
              "formattedLocation" : "Bellevue, WA",
              "source" : "Arenanet",
              "date" : "Wed, 24 Feb 2016 12:49:52 GMT",
              "snippet" : "5 years software development experience with C# and <b>C++</b>. You'll be writing C# and <b>C++</b> code to provide a flexible toolchain that other <b>developers</b> can easily...",
              "url" : "http://www.indeed.com/viewjob?jk=79c06d07aaa0b618&qd=-mW6xvOQ2igwj_Iu4z5QhD5-3lOQSa-noddW6o1Y0cWdrLMf2Pdu_NmAp10NXSzl6CYW7b8moy96aNz9dmbHHQYbF369NApnVHByyDVOuXQ40X9RqMmoWy146cYiCabl&indpubnum=2878037053725137&atk=1ados92u2bq4udbm",
              "onmousedown" : "indeed_clk(this, '9537');",
              "jobkey" : "79c06d07aaa0b618",
              "sponsored" : false,
              "expired" : false,
              "indeedApply" : false,
              "formattedLocationFull" : "Bellevue, WA 98005",
              "formattedRelativeTime" : "18 days ago",
              "noUniqueUrl" : false
          },
          {
              "jobtitle" : "Firmware Developer",
              "company" : "Atharva Inc",
              "city" : "Redmond",
              "state" : "WA",
              "country" : "US",
              "formattedLocation" : "Redmond, WA",
              "source" : "Indeed",
              "date" : "Tue, 08 Mar 2016 19:20:10 GMT",
              "snippet" : "We have *Firmware <b>Developer</b>*. <b>Developer</b> will be involved with UEFI (Unified Extensible Firmware Interface) SW development and/or KMDF. Hi....",
              "url" : "http://www.indeed.com/viewjob?jk=1bb38de341681928&qd=-mW6xvOQ2igwj_Iu4z5QhD5-3lOQSa-noddW6o1Y0cWdrLMf2Pdu_NmAp10NXSzl6CYW7b8moy96aNz9dmbHHQYbF369NApnVHByyDVOuXQ40X9RqMmoWy146cYiCabl&indpubnum=2878037053725137&atk=1ados92u2bq4udbm",
              "onmousedown" : "indeed_clk(this, '9537');",
              "jobkey" : "1bb38de341681928",
              "sponsored" : false,
              "expired" : false,
              "indeedApply" : true,
              "formattedLocationFull" : "Redmond, WA",
              "formattedRelativeTime" : "5 days ago",
              "noUniqueUrl" : true
          },
          {
              "jobtitle" : "Content Developer",
              "company" : "Microsoft",
              "city" : "Redmond",
              "state" : "WA",
              "country" : "US",
              "formattedLocation" : "Redmond, WA",
              "source" : "Microsoft",
              "date" : "Thu, 21 Jan 2016 07:36:51 GMT",
              "snippet" : "Reading knowledge of <b>C++</b> and C. You will work with agile development teams, as well as other content <b>developers</b>....",
              "url" : "http://www.indeed.com/viewjob?jk=ba9b3b32448d2470&qd=-mW6xvOQ2igwj_Iu4z5QhD5-3lOQSa-noddW6o1Y0cWdrLMf2Pdu_NmAp10NXSzl6CYW7b8moy96aNz9dmbHHQYbF369NApnVHByyDVOuXQ40X9RqMmoWy146cYiCabl&indpubnum=2878037053725137&atk=1ados92u2bq4udbm",
              "onmousedown" : "indeed_clk(this, '9537');",
              "jobkey" : "ba9b3b32448d2470",
              "sponsored" : false,
              "expired" : false,
              "indeedApply" : false,
              "formattedLocationFull" : "Redmond, WA 98052",
              "formattedRelativeTime" : "30+ days ago",
              "noUniqueUrl" : false
          },
          {
              "jobtitle" : "Software Development Engineer",
              "company" : "Apptio",
              "city" : "Bellevue",
              "state" : "WA",
              "country" : "US",
              "formattedLocation" : "Bellevue, WA",
              "source" : "Apptio",
              "date" : "Thu, 10 Mar 2016 04:51:23 GMT",
              "snippet" : "5+ years of Java, C#, <b>C++</b>. We\u2019re looking for a <b>developer</b> with expertise and passion in solving difficult problems, and delivering quality products on time to...",
              "url" : "http://www.indeed.com/viewjob?jk=b8dc72e4286cb854&qd=-mW6xvOQ2igwj_Iu4z5QhD5-3lOQSa-noddW6o1Y0cWdrLMf2Pdu_NmAp10NXSzl6CYW7b8moy96aNz9dmbHHQYbF369NApnVHByyDVOuXQ40X9RqMmoWy146cYiCabl&indpubnum=2878037053725137&atk=1ados92u2bq4udbm",
              "onmousedown" : "indeed_clk(this, '9537');",
              "jobkey" : "b8dc72e4286cb854",
              "sponsored" : false,
              "expired" : false,
              "indeedApply" : true,
              "formattedLocationFull" : "Bellevue, WA",
              "formattedRelativeTime" : "3 days ago",
              "noUniqueUrl" : false
          }
        ]
      };
}]); // controller
