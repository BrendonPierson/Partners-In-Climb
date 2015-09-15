(function() {
    'use strict';

    angular.module('myApp.auth.Auth', [])
    .factory("Auth", ["$firebaseAuth",
      function($firebaseAuth) {
        var ref = new Firebase("https://bolt-it.firebaseio.com");
        return $firebaseAuth(ref);
      }
    ]);
})();
