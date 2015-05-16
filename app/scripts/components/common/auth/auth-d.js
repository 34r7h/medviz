'use strict';

/**
* @ngdoc directive
* @name medviz.directive:auth
* @description
* # auth
*/
angular.module('medviz')
.directive('auth', function ()
{
    return {
        templateUrl: 'scripts/components/common/auth/auth-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {
        },
        controller: function ($scope, $state, Api)
        {

            $scope.logout = Api.logout;
            $scope.authCheck = Api.authCheck();
            $scope.newUser = Api.newUser;

        }
    };
});