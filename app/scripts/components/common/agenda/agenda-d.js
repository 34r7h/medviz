'use strict';

/**
* @ngdoc directive
* @name medviz.directive:agenda
* @description
* # agenda
*/
angular.module('medviz')
.directive('agenda', function ()
{
    return {
        templateUrl: 'scripts/components/common/agenda/agenda-d.html',
        
        restrict: 'EA',
        scope: {

        },
        controller: function ($scope, Agenda)
        {

        }
    };
});