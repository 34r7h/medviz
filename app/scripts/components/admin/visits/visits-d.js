'use strict';

/**
* @ngdoc directive
* @name medviz.directive:visits
* @description
* # visits
*/
angular.module('medviz')
.directive('visits', function (Data, $firebaseObject, $firebaseArray)
{
    return {
        templateUrl: 'scripts/components/admin/visits/visits-d.html',

        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: function ($scope)
        {
            $scope.visits = Data.ref.child('visits');
            $scope.visitsObject = $firebaseObject($scope.visits);
            $scope.visitsArray = $firebaseArray($scope.visits);
            console.log('visits dataObject',Data.dataObject);
            $scope.userRef = function(id){
                return Data.dataObject.users[id].name;
            };
            $scope.doctorRef = function(id){
                return Data.dataObject.doctors[id]['doctor name'];
            };
    
            $scope.visitsIndex = Data.ref.child('index/visits');
            $scope.visitsIndexObject = $firebaseObject($scope.visitsIndex);
            $scope.visitsIndexArray = $firebaseArray($scope.visitsIndex);
        }
    };
});