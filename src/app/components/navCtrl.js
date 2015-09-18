(function() {
  'use strict';
  angular.module('myApp.nav', [])
    .controller('NavCtrl', [
      "$scope", "Auth", "$state",
     function($scope, Auth, $state) {

      var authPromise = Auth.$waitForAuth() ;
      authPromise
      .then(function(authData){
        $scope.auth = authData;
        $scope.userName = authData.facebook.displayName;
      })

      

        $scope.logout = function() {
          Auth.$unauth();
          console.log("logged out");
          $state.go("home");
        }
    }]);
})();
