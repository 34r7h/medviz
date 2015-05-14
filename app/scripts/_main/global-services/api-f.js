/**
 * @ngdoc service
 * @name medviz.Api
 * @description
 * # Api
 * Factory in the medviz.
 */
angular.module('medviz')
    .factory('Api', function ($rootScope, $state, Data, Firebase)
    {
        'use strict';

        // INITIALIZATION
        var ref = new Firebase('https://medviz.firebaseio.com');
        var data = Data;

    // Function Definitions
        function login(email, pass) {ref.authWithPassword({email:email,password:pass}, function(error, authData){if (error) {console.log(error);} else {$rootScope.authData = authData; $state.reload()}});}
        function logout(){ref.unauth();$state.go($state.current, {}, {reload: true});}
        function authCheck(){return ref.getAuth();}
        //function reloadState() {$state.go($state.current, {}, {reload: true});}

        // ACTUAL DEFINITION
        var service = {
            login: login,
            logout: logout,
            authCheck: authCheck
        };

        return service;
    });