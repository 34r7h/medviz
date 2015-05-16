/**
 * @ngdoc service
 * @name medviz.Api
 * @description
 * # Api
 * Factory in the medviz.
 */
angular.module('medviz')
    .factory('Api', function ($state, Auth)
    {
        'use strict';

        // INITIALIZATION

    // Function Definitions


        //function reloadState() {$state.go($state.current, {}, {reload: true});}

        // ACTUAL DEFINITION
        var service = {
            login: Auth.login,
            logout: Auth.logout,
            authCheck: Auth.authCheck,
	          newUser: Auth.newUser
        };

        return service;
    });