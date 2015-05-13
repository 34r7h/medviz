/**
 * @ngdoc service
 * @name medviz.Api
 * @description
 * # Api
 * Factory in the medviz.
 */
angular.module('medviz')
    .factory('Api', function ($rootScope, $state, Data)
    {
        'use strict';

        // INITIALIZATION
        var ref = new Firebase("https://medviz.firebaseio.com");
        // ACTUAL DEFINITION
        var service = {
            login: login,
            logout: logout,
            authCheck: authCheck
        };
        var data = Data;

    // Function Definitions
        function login(email, pass) {ref.authWithPassword({email:email,password:pass}, function(er, authData){if (er) {console.log(er);} else {$rootScope.authData = authData;}});}
        function logout(){ref.unauth();$state.go($state.current, {}, {reload: true});}
        function authCheck(){return ref.getAuth()}
        //function reloadState() {$state.go($state.current, {}, {reload: true});}

        return service;
    });