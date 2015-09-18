(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',

    //foundation
    'foundation',

    // Subsection Views
    'myApp.home',
    'myApp.view2',
    'myApp.version',
    'myApp.auth',
    'myApp.login',
    'myApp.about',
    'myApp.crags',
    'myApp.singleCrag',
    'myApp.addClimb',
    'myApp.nav',
    'firebase'
  ])
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider', "$stateProvider"];
  run.$inject = ["$rootScope", "$state"];

  function config($urlProvider, $locationProvider, $stateProvider) {

    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'home/home.html',
      controller: 'HomeCtrl',
      controllerAs: 'home',
      resolve: {
        // controller will not be loaded until $waitForAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function(Auth) {
          // $waitForAuth returns a promise so the resolve waits for it to complete
          return Auth.$waitForAuth();
        }]
      }
    })
    .state('about', {
      url: '/about',
      templateUrl: 'aboutView/about.html',
      controller: 'AboutCtrl',
      controllerAs: 'about',
      resolve: {
        // controller will not be loaded until $waitForAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function(Auth) {
          // $waitForAuth returns a promise so the resolve waits for it to complete
          return Auth.$waitForAuth();
        }]
      }
    })
    .state('crags', {
      url: '/crags',
      templateUrl: 'cragsView/crags.html',
      controller: 'CragsCtrl',
      resolve: {
        // controller will not be loaded until $waitForAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function(Auth) {
          // $waitForAuth returns a promise so the resolve waits for it to complete
          return Auth.$waitForAuth();
        }]
      }
    })
    .state('crag', {
      url: '/crag/:id'  ,
      templateUrl: 'singleCragView/singleCrag.html',
      controller: 'SingleCragCtrl',
      resolve: {
        // controller will not be loaded until $waitForAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function(Auth) {
          // $waitForAuth returns a promise so the resolve waits for it to complete
          return Auth.$waitForAuth();
        }]
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: 'loginView/login.html',
      controller: 'LoginCtrl',
      resolve: {
        // controller will not be loaded until $waitForAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function(Auth) {
          // $waitForAuth returns a promise so the resolve waits for it to complete
          return Auth.$waitForAuth();
        }]
      }
    });
    // .state('about', {
    //   url: '/about',
    //   templateUrl: 'view2/view2.html',
    //   controller: 'View2Ctrl',
    //   resolve: {
    //     // controller will not be loaded until $waitForAuth resolves
    //     // Auth refers to our $firebaseAuth wrapper in the example above
    //     "currentAuth": ["Auth", function(Auth) {
    //       // $waitForAuth returns a promise so the resolve waits for it to complete
    //       return Auth.$requireAuth();
    //     }]
    //   }
    // });




    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  }

  function run($rootScope, $state) {
    FastClick.attach(document.body);

    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireAuth promise is rejected
    // and redirect the user back to the home page
      if (error === "AUTH_REQUIRED") {
        $state.go("home");
      }
    });
  }

})();
