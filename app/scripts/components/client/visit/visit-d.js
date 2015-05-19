'use strict';

/**
* @ngdoc directive
* @name medviz.directive:visit
* @description
* # visit
*/
angular.module('medviz')
.directive('visit', function (Api)
{
    return {
        templateUrl: 'scripts/components/client/visit/visit-d.html',
        
        restrict: 'EA',

        link: function (scope, el, attrs)
        {

        },
        controller: function ($scope)
        {

        }
    };
});