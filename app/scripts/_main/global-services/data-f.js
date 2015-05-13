/**
 * @ngdoc service
 * @name medviz.Data
 * @description
 * # Data
 * Factory in the medviz.
 */
angular.module('medviz')
    .factory('Data', function ($firebaseObject, $firebaseArray, Firebase)
    {
        'use strict';

        // INITIALIZATION
        var ref = new Firebase('https://medviz.firebaseio.com');
        var dataObject=$firebaseObject(ref);
        var dataArray=$firebaseArray(ref);


        // ACTUAL DEFINITION
        var service = {
            dataObject: dataObject,
            dataArray: dataArray
        };

        return service;
    });
