(function() {
  'use strict';
  angular.module('myApp.singleCrag', ['ui.router'])
    .controller('SingleCragCtrl', [
      "$firebaseArray","currentAuth", "$scope", "Auth", "$stateParams", "FoundationApi",
     function($firebaseArray, currentAuth, $scope, Auth, $stateParams, foundationApi) {

      $scope.climbs = [];

      // DEBUG 
      console.log("Climbing area ID:", $stateParams.id);
      console.log("user Auth data", currentAuth);

      // logout function needed for sidebar
      $scope.logout = function() {
        Auth.$unauth();
        console.log("logged out");
      }

      // auth is used by nav to display name or login
      $scope.auth = currentAuth;
      if($scope.auth){
        $scope.userName = currentAuth.facebook.displayName;
      }

      //firebase reference
      var ref = new Firebase("https://bolt-it.firebaseio.com/");
      // download the data into local objects
      var crags = $firebaseArray(ref.child('areas'));
      var climbs = $firebaseArray(ref.child('climbs'));
      $scope.bolt_types = $firebaseArray(ref.child('hardware'));


      
      // Promises for fb data
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

      climbs.$loaded()
        .then(function(climbs){
          console.log("fb climbs", climbs);
          for (var i = 0; i < climbs.length; i++) {
            if (climbs[i].crag_id == $stateParams.id) {
              $scope.climbs[$scope.climbs.length] = climbs[i];
            }
            console.log("area climbs", $scope.climbs);
          };
        })

    // add a new route
    $scope.newRoute = {};

    $scope.addRoute = function(){
      $scope.newRoute.createdBy = currentAuth.uid;
      $scope.newRoute.crag_id = $stateParams.id;
      $scope.newRoute.dateAdded = new Date();

      climbs.$add($scope.newRoute).then(function(ref) {
        var id = ref.key();
        console.log("added record with id " + id);
        $scope.newRoute = {};
        foundationApi.publish('addRouteModal', 'close');
      });

    }

    $scope.setPanelDetails = function(climb){
      $scope.climb = climb;
    }

    $scope.submitClimbEdits = function(){
      console.log("climb", $scope.climb);
      climbs[$scope.climb.$id] = $scope.climb;
      console.log("climb", climbs[$scope.climb.$id]);

      climbs.$save($scope.climb).then(function(ref) {
        console.log("ref", ref);
      });
    }



    }]);
})();
