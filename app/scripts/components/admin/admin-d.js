'use strict';

/**
* @ngdoc directive
* @name medviz.directive:admin
* @description
* # admin
*/
angular.module('medviz')
.directive('admin', function ()
{
    return {
        templateUrl: 'scripts/components/admin/admin-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: function ($scope, Admin)
        {

        }
    };
});