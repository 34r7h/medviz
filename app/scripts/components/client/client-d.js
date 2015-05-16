'use strict';

/**
* @ngdoc directive
* @name medviz.directive:client
* @description
* # client
*/
angular.module('medviz')
.directive('client', function ()
{
    return {
        templateUrl: 'scripts/components/client/client-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: function ($scope, Client)
        {

        }
    };
});