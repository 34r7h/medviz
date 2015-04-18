'use strict';

/**
* @ngdoc directive
* @name medviz.directive:adminUi
* @description
* # adminUi
*/
angular.module('medviz')
.directive('adminUi', function ()
{
    return {
        templateUrl: 'scripts/components/admin/admin-ui/admin-ui-d.html',
        
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