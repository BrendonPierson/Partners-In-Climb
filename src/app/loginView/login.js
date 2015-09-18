(function() {
  'use strict';
  angular.module('myApp.login', ['ui.router', 'foundation.core'])
    .controller('LoginCtrl', [
      "currentAuth", "$state", "$scope", "FoundationApi",
     function(currentAuth, $state, $scope, foundationApi) {

      if (currentAuth === null) {
        var ref = new Firebase("https://bolt-it.firebaseio.com"); 
        ref.authWithOAuthPopup("facebook", function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            // the access token will allow us to make Open Graph API calls
            console.log(authData);
            foundationApi.publish('main-notifications', { title: 'Success', content: 'You are now logged in.', autoclose: '3000' });
            $state.go("crags");
          }
        }, {
          scope: "email" // the permissions requested
        });        
      } else {
        $state.go("crags");
      }


    }]);
})();