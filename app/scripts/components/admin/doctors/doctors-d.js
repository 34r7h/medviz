'use strict';

/**
* @ngdoc directive
* @name medviz.directive:doctor
* @description
* # doctor
*/
angular.module('medviz')
.directive('doctors', function (Api, Data, $firebaseObject, $firebaseArray)
{
    return {
        templateUrl: 'scripts/components/admin/doctors/doctors-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: function ($scope)
        {
            $scope.doctors = Data.ref.child('doctors').limitToFirst(10);
            $scope.doctorsObject = $firebaseObject($scope.doctors);
            $scope.doctorsArray = $firebaseArray($scope.doctors);

            $scope.doctorsIndex = Data.ref.child('index/doctors').limitToFirst(10);
            $scope.doctorsIndexObject = $firebaseObject($scope.doctorsIndex);
            $scope.doctorsIndexArray = $firebaseArray($scope.doctorsIndex);
        }
    };
});