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

      climbs.$watch(function(climbs){
        console.log("fb climbs", climbs);
        for (var i = 0; i < climbs.length; i++) {
          if (climbs[i].crag_id == $stateParams.id) {
            $scope.climbs[$scope.climbs.length] = climbs[i];
          }
          console.log("area climbs", $scope.climbs);
        };
      });

    // add a new route
    $scope.newRoute = {};

    $scope.addRoute = function(){
      var time = new Date();
      $scope.newRoute.dateAdded = time.getTime();
      $scope.newRoute.createdBy = currentAuth.uid;
      $scope.newRoute.crag_id = $stateParams.id;

      // Turn entered date string into data object
      var rawArr = $scope.newRoute.last_bolted.split("/").map(function(n){return parseInt(n)});
      var dateArr = [];
      dateArr[0] = rawArr[2];
      dateArr[1] = rawArr[0];
      dateArr[2] = rawArr[1];
      var lastBolted = new Date(dateArr.join(","));
      $scope.newRoute.last_bolted = lastBolted.getTime();

      climbs.$add($scope.newRoute).then(function(ref) {
        console.log("added record " + ref);
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

      var rating = 0;
    $scope.vote = function(climb, direction){
      console.log("vote: ", direction);
      console.log("climb", climb);
      rating = direction > 1 ? rating + 1 : rating -1 ;
      // $scope.climb.rating += direction > 1 ? 1 : -1 ;
      console.log(rating);

    }


    }]);
})();
