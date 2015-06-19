'use strict';

/**
* @ngdoc directive
* @name medviz.directive:agenda
* @description
* # agenda
*/
angular.module('medviz')
.directive('agenda', function ()
{
    return {
        templateUrl: 'scripts/components/common/agenda/agenda-d.html',
        
        restrict: 'EA',
        controller: function ($scope,  $rootScope, Agenda, Api, Data, $timeout)
        {
            $timeout(function(){
                $scope.user = $rootScope.id;
                $scope.userAgenda = Data.dataObject.users[$scope.user];
            },3000);
            $scope.addTask = function(task){
                console.log('adding task', task);
                if(!$scope.userAgenda.agenda){
                    $scope.userAgenda.agenda = {tasks:{}};
                }
                $scope.userAgenda.agenda.tasks.$push(task);
            };
            $scope.addAppointment = function(appointment){
                console.log('adding appointment', appointment);
                if(!$scope.userAgenda.agenda){
                    $scope.userAgenda.agenda = {schedule:{}}
                }
                $scope.userAgenda.agenda.schedule.$push(appointment);

            };
        }
    };
});