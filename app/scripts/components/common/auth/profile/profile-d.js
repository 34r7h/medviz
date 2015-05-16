'use strict';

/**
* @ngdoc directive
* @name medviz.directive:profile
* @description
* # profile
*/
angular.module('medviz')
.directive('profile', function ()
{
    return {
        templateUrl: 'scripts/components/common/auth/profile/profile-d.html',

        restrict: 'EA',
        /*scope: {

        },*/
        link: function (scope, el, attrs)
        {

        },
        controller: function ($scope)
        {

        }
    };
});
