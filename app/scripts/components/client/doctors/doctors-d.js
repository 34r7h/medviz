'use strict';

/**
* @ngdoc directive
* @name medviz.directive:doctors
* @description
* # doctors
*/
angular.module('medviz')
.directive('doctors', function ()
{
    return {
        templateUrl: 'scripts/components/client/doctors/doctors-d.html',
        
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