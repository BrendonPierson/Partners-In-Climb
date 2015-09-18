(function() {
  'use strict';
  angular.module('myApp.about', [])
    .controller('AboutCtrl', [
      "currentAuth", "$scope", "Auth",
      function(currentAuth, $scope, Auth) {
        console.log("currentAuth: ", currentAuth);
            
      
      this.title = "Partners in Climb";


    }]);
})();
