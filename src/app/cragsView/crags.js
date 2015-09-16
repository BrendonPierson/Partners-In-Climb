(function() {
  'use strict';
  angular.module('myApp.crags', ['ui.router'])
    .controller('CragsCtrl', [
      "$firebaseArray","currentAuth", "$scope", "Auth",
     function($firebaseArray, currentAuth, $scope, Auth) {

      // auth is used by nav to display name or login
      $scope.auth = currentAuth;
      if($scope.auth){
        $scope.userName = currentAuth.facebook.displayName;
      }

      console.log(currentAuth);
      
      this.title = "HOME";

      var ref = new Firebase("https://bolt-it.firebaseio.com/areas");
      // download the data into a local object
      var list = $firebaseArray(ref);
      $scope.crags = list;
      list.$loaded()
        .then(function(x) {
          console.log("firebase crags", x); 
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
