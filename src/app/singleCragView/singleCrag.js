(function() {
  'use strict';
  angular.module('myApp.singleCrag', ['ui.router'])
    .controller('SingleCragCtrl', [
      "$firebaseArray","$firebaseObject","currentAuth", "$scope", "Auth", "$stateParams", "FoundationApi",
     function($firebaseArray, $firebaseObject, currentAuth, $scope, Auth, $stateParams, foundationApi) {

      $scope.climbs = [];

      // DEBUG 
      console.log("Climbing area ID:", $stateParams.id);
      console.log("user Auth data", currentAuth);
      $scope.auth = currentAuth;

      //firebase reference
      var ref = new Firebase("https://bolt-it.firebaseio.com/");
      // download the data into local objects
      var crags = $firebaseArray(ref.child('areas'));
      var climbs = $firebaseArray(ref.child('climbs'));
      var ratings = $firebaseObject(ref.child('ratings'));
     
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
          var climbsArr = [];
          console.log("fb climbs", climbs);
          for (var i = 0; i < climbs.length; i++) {
            if (climbs[i].crag_id == $stateParams.id) {
              climbsArr[climbsArr.length] = climbs[i];
            }
          }
          $scope.climbs = _.sortBy(climbsArr, 'rating').reverse();
          console.log("area climbs", $scope.climbs);
        })

      climbs.$watch(function(climbs){
        // console.log("fb climbs", climbs);
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
      if($scope.newRoute.last_bolted){
        var rawArr = $scope.newRoute.last_bolted.split("/").map(function(n){return parseInt(n)});
        var dateArr = [];
        dateArr[0] = rawArr[2];
        dateArr[1] = rawArr[0];
        dateArr[2] = rawArr[1];
        var lastBolted = new Date(dateArr.join(","));
        $scope.newRoute.last_bolted = lastBolted.getTime();
      }

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
   
    $scope.vote = function(climb, direction){
      console.log("vote: ", direction);
      console.log("climb", climb);
      var upVoteUsers = $firebaseArray(ref.child('climbs/' + climb.$id + "/upVoteUsers"));
      var downVoteUsers = $firebaseArray(ref.child('climbs/' + climb.$id + "/downVoteUsers"));

      if(direction > 1) {
        upVoteUsers.$loaded().then(function(){
          if(_.find(upVoteUsers,'$value', currentAuth.uid)) {
            console.log("user has already voted up");
            foundationApi.publish('ratingChange', {autoclose:'3000', color: 'alert', title: '', content: 'Already up voted ' + climb.name + '.'});
            updateRating();
          } else {
            upVoteUsers.$add(currentAuth.uid);
            downVoteUsers.$loaded().then(function(){
                if(checkForUid(downVoteUsers, currentAuth.uid)){
                  climb.rating += 1;
                }
              });
            foundationApi.publish('ratingChange', { autoclose:'3000', title: 'Success', content: 'Up voted ' + climb.name + '.'});
            climb.rating += 1;
            updateRating();
          }
          console.log("upVoteUsers", upVoteUsers);
        })
      } else if (direction < 2) {
        downVoteUsers.$loaded().then(function(downVoteUsers){
          if(_.find(downVoteUsers,'$value', currentAuth.uid)) {
            console.log("user has already voted down")
            foundationApi.publish('ratingChange', {autoclose:'3000', color: 'alert', title: '', content: 'Already down voted ' + climb.name + '.'});
            updateRating();
          } else {
            downVoteUsers.$add(currentAuth.uid);
            upVoteUsers.$loaded().then(function(){
                if(checkForUid(upVoteUsers, currentAuth.uid)){
                  climb.rating -= 1;
                }
              });
            foundationApi.publish('ratingChange', { autoclose:'3000', title: 'Success', content: 'Down voted ' + climb.name + '.'});
            climb.rating -= 1;
            updateRating();
          }
          console.log("downVoteUsers", downVoteUsers);
        })
      }

      // setTimeout(function(){
      //   foundationApi.publish('ratingChange', 'close');
      // }, 3000);

      function updateRating(){
        console.log("upVoteUsers.length", upVoteUsers.length);
        console.log("downVoteUsers.length", downVoteUsers.length);

        climbs.$save(climb).then(function(ref){
          console.log("saved");
        })
      }
    }

    function checkForUid(arr, uid){
      var duplicate = false;
      for (var i = 0; i < arr.length; i++) {
        if(arr[i].$value === uid) {
          arr.$remove(arr[i]);
          duplicate = true;
        }
      };
      return duplicate;
    }



    }]);
})();
