'use strict';

/**
* @ngdoc directive
* @name medviz.directive:map
* @description
* # map
*/
angular.module('medviz')
.directive('map', function ()
{
    return {
        templateUrl: 'scripts/components/client/map/map-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: function ($scope)
        {

        }
    };
});