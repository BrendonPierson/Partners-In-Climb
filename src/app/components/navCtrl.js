(function() {
  'use strict';
  angular.module('myApp.nav', [])
    .controller('NavCtrl', [
      "$scope", "Auth", "$state", "FoundationApi",
      function($scope, Auth, $state, foundationApi) {

      var authPromise = Auth.$waitForAuth() ;
      authPromise
      .then(setAuthData);

      function setAuthData(authData){
        $scope.auth = authData;
        $scope.userName = authData.facebook.displayName;
        $scope.firstName = authData.facebook.cachedUserProfile.first_name;
      }

      Auth.$onAuth(setAuthData);

      $scope.logout = function() {
        Auth.$unauth();
        console.log("logged out");
        foundationApi.publish('userInfo', 'close');
        $state.go("home");
      }







    }]);
})();
