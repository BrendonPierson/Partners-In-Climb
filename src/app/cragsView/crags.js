(function() {
  'use strict';
  angular.module('myApp.crags', ['ui.router'])
    .controller('CragsCtrl', [
      "$firebaseArray","currentAuth", "$scope", "Auth", 'FoundationApi',
     function($firebaseArray, currentAuth, $scope, Auth, foundationApi) {

      // auth is used by nav to display name or login
      $scope.auth = currentAuth;
      if($scope.auth){
        $scope.userName = currentAuth.facebook.displayName;
      }

      // DEBUG console.logs
      console.log(currentAuth);

      // Logout funciton
      $scope.logout = function() {
        Auth.$unauth();
        console.log("logged out");
      }

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

        $scope.newCrag = {};

        $scope.addCrag = function(){
          console.log("newCrag: ", $scope.newCrag);
          list.$add($scope.newCrag).then(function(ref) {
            var id = ref.key();
            console.log("added record with id " + id);
            $scope.newCrag = {};
            foundationApi.publish('addClimbModal', 'close');
          });
        }




    }]);
})();
