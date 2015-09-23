(function() {
  'use strict';
  angular.module('myApp.crags', ['ui.router'])
    .controller('CragsCtrl', [
      "$firebaseArray","currentAuth", "$scope", "Auth", 'FoundationApi',
     function($firebaseArray, currentAuth, $scope, Auth, foundationApi) {

      // DEBUG console.logs
      console.log(currentAuth);


      var ref = new Firebase("https://bolt-it.firebaseio.com/areas");
      // download the data into a local object
      var list = $firebaseArray(ref);
      $scope.crags = list;
      list.$loaded()
        .then(function(x) {
          console.log("firebase crags", x); 
        })
        .catch(function(error) {
          console.log("Error:", error);
        });


        // Add new crag function
        $scope.newCrag = {};
        $scope.addCrag = function(){
          if(_.find($scope.crags, 'name', $scope.newCrag.name)) {
            foundationApi.publish('ratingChange', { color: 'alert', autoclose:'3000', title: '', content: $scope.newCrag.name + ' already exists.'});
          } else {
            $scope.newCrag.addedByUid = currentAuth.uid;
            $scope.newCrag.addedBy = currentAuth.facebook.displayName;
            console.log("newCrag: ", $scope.newCrag);
            list.$add($scope.newCrag).then(function(ref) {
              var id = ref.key();
              console.log("added record with id " + id);
              $scope.newCrag = {};
              foundationApi.publish('addClimbModal', 'close');
            });
          }
        }




    }]);
})();
