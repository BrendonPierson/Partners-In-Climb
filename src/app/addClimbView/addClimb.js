(function() {
  'use strict';
  angular.module('myApp.addClimb', ['ui.router'])
    // .config(['$stateProvider', function($stateProvider) {
    //   $stateProvider.state('home', {
    //     url: '/',
    //     templateUrl: 'home/home.html',
    //     controller: 'HomeCtrl',
    //     controllerAs: 'home',
    //   });
    // }])
    .controller('AddClimbCtrl', [
      "$firebaseArray","currentAuth", "$scope", "Auth",
     function($firebaseArray, currentAuth, $scope, Auth) {

      // auth is used by nav to display name or login
      $scope.auth = currentAuth;
      if($scope.auth){
        $scope.userName = currentAuth.facebook.displayName;
      }

      console.log(currentAuth);
      
      this.title = "HOME";

      var ref = new Firebase("https://bolt-it.firebaseio.com");
      // download the data into a local object
      var list = $firebaseArray(ref);
      list.$loaded()
        .then(function(x) {
          console.log(x); // true
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
