'use strict';

/**
* @ngdoc directive
* @name medviz.directive:medvizHeader
* @description
* # medvizHeader
*/
angular.module('medviz')
.directive('medvizHeader', function (Data)
{
    return {
        templateUrl: 'scripts/components/layout/medviz-header/medviz-header-d.html',
        restrict: 'EA',
        scope: {},
        link: function (scope, el, attrs)
        {
            scope.data = Data;
        },
        controller: function ($scope)
        {
            $scope.ctrlData = Data.test;
        }
    };
});
