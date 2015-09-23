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
        // if (authData.provider === 'password'){
        //   console.log("email login");
        //   console.log("authData.uid",authData.uid);
          var ref = new Firebase("https://bolt-it.firebaseio.com/users/"+ authData.uid);
          ref.on('value', function(data){
            $scope.userData = data.val();

            console.log("userData", $scope.userData);
          });

        // } else {
        //   console.log("facebook login");
        //   $scope.userName = authData.facebook.displayName;
        //   $scope.firstName = authData.facebook.cachedUserProfile.first_name;
        // }
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
