/**
 * @ngdoc service
 * @name medviz.Api
 * @description
 * # Api
 * Factory in the medviz.
 */
angular.module('medviz')
    .factory('Api', function (Auth, Admin, Client)
    {
        'use strict';

        // INITIALIZATION

    // Function Definitions
	    console.log('API Factory Injected With: ',arguments);

	    //function reloadState() {$state.go($state.current, {}, {reload: true});}

        // ACTUAL DEFINITION
        var service = {
            login: Auth.login,
            logout: Auth.logout,
            authCheck: Auth.authCheck,
	          newUser: Auth.newUser,
            create: Admin.create,
            upload: Admin.upload,
            update: Admin.update,
            remove: Admin.remove,
            newVisit: Client.newVisit

        };

        return service;
    });