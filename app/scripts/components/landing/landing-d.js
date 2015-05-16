'use strict';

/**
* @ngdoc directive
* @name medviz.directive:landing
* @description
* # landing
*/
angular.module('medviz')
.directive('landing', function ()
{
    return {
        templateUrl: 'scripts/components/landing/landing-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: function ($scope, Landing)
        {

        }
    };
});