app_mbsjobs.controller("AdminController", ["$scope", "$http", function($scope, $http){
  $scope.trackingCode = "Javascript only please..."; //ng-model
  $scope.trackingMessage = "";

  ///
  /// Add/update dynamic tracking code.
  ///
  $scope.addTrackingCode = function(){
    $http({
      method: "POST",
      url: "/api/tracking",
      data: {
        trackingCode: $scope.trackingCode
      }
    }).then(
        function(response){
          $scope.trackingMessage = "Successfully added tracking code.";
          $scope.trackingCode = "";
        },
        function(response){
          $scope.trackingMessage = "Error adding tracking code.";
    });
  };

}]);
