(function() {
    'use strict';
    angular.module('myApp.home', ['ui.router'])
        .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('home', {
                url: '/',
                templateUrl: 'home/home.html',
                controller: 'HomeCtrl',
                controllerAs: 'home'
            });
        }])
        .controller('HomeCtrl', ["$firebaseArray", function($firebaseArray) {
          this.title = "HOME";

            var ref = new Firebase("https://bolt-it.firebaseio.com");
            // download the data into a local object
            var list = $firebaseArray(ref);
            list.$loaded()
              .then(function(x) {
                console.log(x); // true
              })
              .catch(function(error) {
                console.log("Error:", error);
              });
        }]);
})();
