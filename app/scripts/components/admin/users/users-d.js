'use strict';

/**
* @ngdoc directive
* @name medviz.directive:users
* @description
* # users
*/
angular.module('medviz')
.directive('users', function (Api, Data, $firebaseObject, $firebaseArray)
{
    return {
        templateUrl: 'scripts/components/admin/users/users-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: function ($scope)
        {
            $scope.users = Data.ref.child('users');
            $scope.usersObject = $firebaseObject($scope.users);
            $scope.usersArray = $firebaseArray($scope.users);

            $scope.usersIndex = Data.ref.child('index/users');
            $scope.usersIndexObject = $firebaseObject($scope.usersIndex);
            $scope.usersIndexArray = $firebaseArray($scope.usersIndex);

            $scope.update = Api.update;
        }
    };
});