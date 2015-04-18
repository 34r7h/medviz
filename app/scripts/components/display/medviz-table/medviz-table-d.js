'use strict';

/**
* @ngdoc directive
* @name medviz.directive:medvizTable
* @description
* # medvizTable
*/
angular.module('medviz')
.directive('medvizTable', function ()
{
    return {
        templateUrl: 'scripts/components/display/medviz-table/medviz-table-d.html',
        
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