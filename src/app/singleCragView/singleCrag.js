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

      // Find the crag that equals the /:id and set it to $scope.crag
      ref.child('areas').orderByKey().equalTo($stateParams.id).on('value', function(data){
        $scope.crag = data.val();
      });

      // Create array of climbs only for this area through fb query
      var climbsQuery = ref.child('climbs').orderByChild('crag_id').equalTo($stateParams.id);
      $scope.climbs = $firebaseArray(climbsQuery);
     
     // Store bolt types for select menu
      $scope.bolt_types = $firebaseArray(ref.child('hardware'));



      // $scope.climbs.$watch(function(){
      //   $scope.climbs = _.sortBy($scope.climbs, 'rating').reverse();
      //   console.log("area climbs", $scope.climbs);
      // });

    // add a new route
    $scope.newRoute = {};

    $scope.addRoute = function(){
      // First check to see if climb exists, if so send alert
      if(_.find($scope.climbs, 'name', $scope.newRoute.name)) {
        foundationApi.publish('ratingChange', { color: 'alert', autoclose:'3000', title: '', content: $scope.newRoute.name + ' already exists.'});
      } else {
        // Add additional info to user object
        $scope.newRoute.dateAdded = new Date().getTime();
        $scope.newRoute.createdBy = currentAuth.uid;
        $scope.newRoute.crag_id = $stateParams.id;
        $scope.newRoute.rating= 0;

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

        // Save the object to the firebase array, notify user
        $scope.climbs.$add($scope.newRoute).then(function(ref) {
          console.log("added record " + ref);
          foundationApi.publish('addRouteModal', 'close');
          foundationApi.publish('ratingChange', { autoclose:'3000', title: 'Success', content: 'Added ' + $scope.newRoute.name + '.'});
          $scope.newRoute = {};
        });
      }
    }

    // Set panel details to clicked on climb
    $scope.setPanelDetails = function(climb){
      $scope.climb = climb;
    }

    //Save the edits made in the panel 
    $scope.submitClimbEdits = function(){
      console.log("climb", $scope.climb);
      $scope.climbs.$save($scope.climb);
      foundationApi.publish('ratingChange', { autoclose:'3000', title: 'Success', content: 'Updated ' + $scope.climb.name + '.'});
           
    }
   
    // Up and down vote function for ranking climbs in need
    $scope.vote = function(climb, direction){
      // Arrays that hold user votes for up and down
      var upVoteUsers = $firebaseArray(ref.child('climbs/' + climb.$id + "/upVoteUsers"));
      var downVoteUsers = $firebaseArray(ref.child('climbs/' + climb.$id + "/downVoteUsers"));
      // Check to see if user is logged in, if not alert
      if(!currentAuth){
        foundationApi.publish('ratingChange', {autoclose:'3000', color: 'alert', title: '', content: 'Must be logged in to vote.'});
      }

      // User hit thumb up
      if(direction > 1) {
        // Make sure fb array is loaded
        upVoteUsers.$loaded().then(function(){
          // Check to see if the user has already upvoted, if so alert
          if(_.find(upVoteUsers,'$value', currentAuth.uid)) {
            foundationApi.publish('ratingChange', {autoclose:'3000', color: 'alert', title: '', content: 'Already up voted ' + climb.name + '.'});
          } else {
            // User's uid is added to up array
            upVoteUsers.$add(currentAuth.uid);
            downVoteUsers.$loaded().then(function(){
                // If user had previously voted down, this is undone by adding an additional point to the rating
                if(checkForUid(downVoteUsers, currentAuth.uid)){
                  climb.rating += 1;
                }
              });
            // Success alert, increment climb rating, save the rating with update function
            foundationApi.publish('ratingChange', { autoclose:'3000', title: 'Success', content: 'Up voted ' + climb.name + '.'});
            climb.rating += 1;
            updateRating();
          }
        });
      } else if (direction < 2) {
        downVoteUsers.$loaded().then(function(downVoteUsers){
          if(_.find(downVoteUsers,'$value', currentAuth.uid)) {
            console.log("user has already voted down")
            foundationApi.publish('ratingChange', {autoclose:'3000', color: 'alert', title: '', content: 'Already down voted ' + climb.name + '.'});
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
        });
      } // End if else for up or down

      function updateRating(){
        climbs.$save(climb).then(function(ref){
          console.log("saved");
        });
      }

    } // End vote function

    // Function to check if uid exists in array
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
