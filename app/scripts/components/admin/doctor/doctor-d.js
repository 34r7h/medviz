'use strict';

/**
* @ngdoc directive
* @name medviz.directive:doctor
* @description
* # doctor
*/
angular.module('medviz')
.directive('doctor', function (Data, $firebaseObject, $firebaseArray)
{
    return {
        templateUrl: 'scripts/components/admin/doctor/doctor-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: function ($scope)
        {
            $scope.doctors = Data.ref.child('doctors');
            $scope.doctorsObject = $firebaseObject($scope.doctors);
            $scope.doctorsArray = $firebaseArray($scope.doctors);

            $scope.doctorsIndex = Data.ref.child('index/doctors');
            $scope.doctorsIndexObject = $firebaseObject($scope.doctorsIndex);
            $scope.doctorsIndexArray = $firebaseArray($scope.doctorsIndex);
        }
    };
});