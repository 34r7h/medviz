'use strict';

/**
* @ngdoc directive
* @name medviz.directive:reg
* @description
* # reg
*/
angular.module('medviz')
.directive('reg', function ()
{
    return {
        templateUrl: 'scripts/components/common/auth/reg/reg-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: function ($scope, Api)
        {
            $scope.newUser = Api.newUser;
        }
    };
});