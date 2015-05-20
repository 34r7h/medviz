'use strict';

/**
* @ngdoc directive
* @name medviz.directive:drugs
* @description
* # drugs
*/
angular.module('medviz')
.directive('drugs', function ()
{
    return {
        templateUrl: 'scripts/components/admin/drugs/drugs-d.htmll',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: function ($scope)
        {
            $scope.drugs = Data.ref.child('drugs');
            $scope.drugsObject = $firebaseObject($scope.drugs);
            $scope.drugsArray = $firebaseArray($scope.drugs);
    
            $scope.drugsIndex = Data.ref.child('index/drugs');
            $scope.drugsIndexObject = $firebaseObject($scope.drugsIndex);
            $scope.drugsIndexArray = $firebaseArray($scope.drugsIndex);
        }
    };
});