'use strict';

/**
* @ngdoc directive
* @name medviz.directive:signIn
* @description
* # signIn
*/
angular.module('medviz')
.directive('signIn', function ()
{
    return {
        templateUrl: 'scripts/components/common/auth/sign-in/sign-in-d.html',
        
        restrict: 'EA',

        link: function (scope, el, attrs)
        {

        },
        controller: function ($scope, Api)
        {
            $scope.login = Api.login;
        }
    };
});