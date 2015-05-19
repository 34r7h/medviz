/**
 * @ngdoc service
 * @name medviz.Client
 * @description
 * # Client
 * Factory in the medviz.
 */
angular.module('medviz')
    .factory('Client', function (Data, $firebaseObject, $firebaseArray)
    {
        'use strict';

        // INITIALIZATION
        function newVisit(user, doctor) {
            console.log('visit args', arguments);
            $scope.visits = Data.ref.child('visits');
            $scope.visitsObject = $firebaseObject($scope.visits);
            $scope.visitsArray = $firebaseArray($scope.visits);
            $scope.newVisit = {
                date: Date.now(),
                doctor: doctor,
                user: user,
                drugs: 'druggggggs'
            };
            $scope.visitsArray.$add($scope.newVisit);
            $scope.user = Data.ref.child('index/users/uid/'+user);
	        $scope.userObject = $firebaseObject($scope.user);
	        console.log('user as pertaining to a visit', $scope.userObject);


        }

        // ACTUAL DEFINITION
        var service = {
            newVisit: newVisit
        };

        return service;
    });