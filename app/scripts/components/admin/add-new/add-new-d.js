'use strict';

/**
* @ngdoc directive
* @name medviz.directive:addNew
* @description
* # addNew
*/
angular.module('medviz')
.directive('addNew', function (Api, Data)
{
    return {
        templateUrl: 'scripts/components/admin/add-new/add-new-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: function ($scope)
        {
            $scope.newModels = Data.newModels;
            $scope.createEntry = Api.create;
            $scope.addNewModels = {};
            Api.refreshAddNewModel($scope.newModels, $scope.addNewModels);
            $scope.refreshAddNewModel = Api.refreshAddNewModel;
        }
    };
});