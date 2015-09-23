(function() {
  'use strict';
  angular.module('myApp.login', ['ui.router', 'foundation.core'])
    .controller('LoginCtrl', [
      "currentAuth", "$state", "$scope", "FoundationApi", "$firebaseArray",
     function(currentAuth, $state, $scope, foundationApi, $firebaseArray) {
      $scope.email;
      $scope.passord;
      $scope.newUser = {};
      var ref = new Firebase("https://bolt-it.firebaseio.com"); 
      var User = function(first_name, last_name, email, picture_url, gender, facebook_url, uid, display_name) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.picture_url = picture_url;
        this.gender = gender;
        this.facebook_url = facebook_url;
        this.uid = uid;
        this.display_name = display_name;
          
        this.date_added = new Date().getTime();
        this.admin = false;
      }


    $scope.emailLogin = function(){
      ref.authWithPassword({
        email    : $scope.email,
        password : $scope.password
      }, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
          foundationApi.publish('main-notifications', { title: 'Welcome back!', content:  'You are now logged in.', autoclose: '3000' });
          $state.go('crags');
        }
      });
    }


    $scope.createNewUser = function(){
      ref.createUser({
        email    : $scope.newUser.email,
        password : $scope.newUser.password
      }, function(error, userData) {
        if (error) {
          console.log("Error creating user:", error);
        } else {
          $scope.newUser.password = null;
          $scope.newUser.admin = false;
          $scope.newUser.date_added = new Date().getTime();
          $scope.newUser.display_name = $scope.newUser.first_name + " " + $scope.newUser.first_name;
          $scope.newUser.uid = userData.uid;
          ref.child('users/'+ userData.uid).set($scope.newUser);
          console.log("Successfully created user account with uid:", userData.uid);
          foundationApi.publish('main-notifications', { title: 'Success', content:  'New account created for' + $scope.newUser.display_name, autoclose: '3000' });
          foundationApi.publish('newUser', 'close');
        }
        $scope.newUser = {};
      });
    }

      $scope.login = function(){
        if (currentAuth === null) {
          ref.authWithOAuthPopup("facebook", function(error, authData) {
            if (error) {
              console.log("Login Failed!", error);
            } else {
              console.log(authData);
              var users = $firebaseArray(ref.child('users'));
              users.$loaded()
              .then(function(){
                console.log("users", users);
                if(_.find(users,'$value', authData.uid)){
                  foundationApi.publish('main-notifications', { title: 'Welcome back ' + authData.facebook.cachedUserProfile.first_name + "!", content:  'You are now logged in.', autoclose: '3000' });
                  console.log("user exists");
                } else {
                  authData.data_added = new Date().getTime();
                  var user = new User(authData.facebook.cachedUserProfile.first_name, authData.facebook.cachedUserProfile.last_name, authData.facebook.email, authData.facebook.profileImageURL, authData.facebook.cachedUserProfile.gender, authData.facebook.cachedUserProfile.link, authData.uid, authData.facebook.displayName);
                  ref.child('users/'+ authData.uid).set(user);
                  foundationApi.publish('main-notifications', { title: 'Welcome ' + authData.facebook.cachedUserProfile.first_name + "!", content:  'You are now logged in.', autoclose: '3000' });
                }              
              })
              
              $state.go("crags");
            }
          }, {
            scope: "email" // the permissions requested
          });        
        } else {
          $state.go("crags");
        }
      };



    }]);
})();