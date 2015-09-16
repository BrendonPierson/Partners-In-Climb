(function() {
  'use strict';
  angular.module('myApp.singleCrag', ['ui.router'])
    .controller('SingleCragCtrl', [
      "$firebaseArray","currentAuth", "$scope", "Auth", "$stateParams",
     function($firebaseArray, currentAuth, $scope, Auth, $stateParams) {

      console.log("stateParams", $stateParams.id);

      // auth is used by nav to display name or login
      $scope.auth = currentAuth;
      if($scope.auth){
        $scope.userName = currentAuth.facebook.displayName;
      }



      console.log(currentAuth);
      
      this.title = "HOME";

      var ref = new Firebase("https://bolt-it.firebaseio.com/areas");
      // download the data into a local object
      var crags = $firebaseArray(ref);
      
      crags.$loaded()
        .then(function(crags) {
          console.log("firebase crags", crags); 
          for (var i = 0; i < crags.length; i++) {
            if(crags[i].$id === $stateParams.id) {
              console.log(crags[i]);
              $scope.crag = crags[i];
            }
          };
        })
        .catch(function(error) {
          console.log("Error:", error);
        });

        $scope.logout = function() {
          Auth.$unauth();
          console.log("logged out");
        }
    }]);
})();
