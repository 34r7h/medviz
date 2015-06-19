'use strict';

/**
* @ngdoc directive
* @name medviz.directive:doctors
* @description
* # doctors
*/
angular.module('medviz')
.directive('doctor', function ()
{
    return {
        templateUrl: 'scripts/components/client/doctor/doctor-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: function ($scope, Data, $firebaseObject, $firebaseArray, Api)
        {
            $scope.doctors = Data.ref.child('doctors');
            $scope.doctorsObject = $firebaseObject($scope.doctors);
            $scope.doctorsArray = $firebaseArray($scope.doctors);

            $scope.doctorsIndex = Data.ref.child('index/doctors');
            $scope.doctorsIndexObject = $firebaseObject($scope.doctorsIndex);
            $scope.doctorsIndexArray = $firebaseArray($scope.doctorsIndex);

            $scope.newVisit = Api.newVisit;
        }
    };
});