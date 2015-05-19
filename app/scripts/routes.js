/**
 * @ngdoc overview
 * @name medviz.routes
 * @description
 * # medviz.routes
 *
 * Routes module. All app states are defined here.
 */

angular.module('medviz')
	.config(function ($stateProvider, $urlRouterProvider) {
		'use strict';

		$stateProvider
			.state('medviz', {
				url: '',
				abstract: true,
				template: '<medviz-header></medviz-header>' +
				'<div ui-view ></div>' +
				'<medviz-footer></medviz-footer>',
				controller: function($scope, $state, Data, Api, $rootScope){
					$scope.view = {};
					$scope.ctrlData = Data.test;
					$scope.view.section='';
					$scope.view.view=$state.params.view;
					$rootScope.auth = Api.authCheck();


				}
			})
			.state('medviz.landing', {
				url: '/',
				template: '<landing></landing>',
				controller: function($scope){}
			})
			.state('medviz.client', {
				url: '/client',
				template: '<client></client>'

			})

			.state('medviz.admin', {
				url: '/admin',
				template: '<admin></admin>'
			})

			/* STATES-NEEDLE - DO NOT REMOVE THIS */;
		$urlRouterProvider.otherwise('/');
	});
