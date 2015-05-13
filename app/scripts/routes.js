/**
 * @ngdoc overview
 * @name medviz.routes
 * @description
 * # medviz.routes
 *
 * Routes module. All app states are defined here.
 */

angular.module('medviz')
	.config(function ($stateProvider) {
		'use strict';

		$stateProvider
			.state('medviz', {
				url: '',
				template: '<medviz-header></medviz-header>' +
				'<div ui-view="{{view.view}}" class="grid-container"></div>' +
				'<medviz-footer></medviz-footer>',
				controller: function($scope, $state, Data, Api){
					$scope.view = {};
					$scope.ctrlData = Data.test;
					$scope.view.section='';
					$scope.view.view=$state.params.view;


				}
			})
			.state('medviz.client', {
				url: '/client/:view',
				views: {
					'':{
						template:'<auth></auth>'
					},
					'doctors':{
						template:'<agenda></agenda>'
					},
					'form': {
						template:'<medviz-form></medviz-form>'
					}
				}
			})
			/*.state('medviz.auth.login', {
				url: '/auth',
				template: '<auth></auth>'
			})
			.state('medviz.client.agenda', {
				url: '/agenda',
				template: '<agenda></agenda>'
			})
			.state('medviz.client.visit', {
				url: '/visit',
				template: '<profile></profile><medviz-form></medviz-form>'
			})
			.state('medviz.client.submit', {
				url: '/submit',
				template: '<medviz-table>'
			})*/
			.state('medviz.admin', {
				url: '/admin/:view',
				//template: '<ui-view></ui-view>'
				views:{
					'':{
						template:'<auth></auth>'
					},
					login:{
						template:'<auth></auth>'
					},
					dashboard:{
						template: '<medviz-sections></medviz-sections>'
					}
				}
			})
			/*.state('medviz.admin.dashboard', {
				url: '/dashboard',
				template: '<profile></profile><medviz-sections></medviz-sections><medviz-form></medviz-form><medviz-table></medviz-table><admin-ui></admin-ui>'
			})*/
			.state('medviz.landing', {
				url: '/landing/:view',
				//template: '<fold></fold><features></features><testimonials></testimonials>',
				views:{
					'':{
						template:'<fold></fold><features></features><testimonials></testimonials>'
					},
					fold:{
						template:'<fold></fold>'
					},
					features:{
						template:'<features></features>'
					},
					testimonials:{
						template:'<testimonials></testimonials>'
					}
				}
			})
			/* STATES-NEEDLE - DO NOT REMOVE THIS */;

	});
