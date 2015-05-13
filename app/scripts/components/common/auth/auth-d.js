'use strict';

/**
* @ngdoc directive
* @name medviz.directive:auth
* @description
* # auth
*/
angular.module('medviz')
.directive('auth', function (Api, Data)
{
    return {
        templateUrl: 'scripts/components/common/auth/auth-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {
        },
        controller: function ($scope, $state)
        {

            $scope.login = Api.login;
            $scope.logout = Api.logout;
            $scope.authCheck = Api.authCheck();

            $scope.dataArray = Data.dataArray;
            $scope.dataObject = Data.dataObject;


        }
    };
});