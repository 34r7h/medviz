'use strict';

/**
* @ngdoc directive
* @name medviz.directive:medvizNav
* @description
* # medvizNav
*/
angular.module('medviz')
.directive('medvizNav', function ()
{
    return {
        templateUrl: 'scripts/components/layout/medviz-nav/medviz-nav-d.html',
        
        restrict: 'EA',

        link: function (scope, el, attrs)
        {

        },
        controller: function ($scope)
        {

        }
    };
});