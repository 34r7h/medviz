/**
 * @ngdoc overview
 * @name medviz.routes
 * @description
 * # medviz.routes
 *
 * Routes module. All app states are defined here.
 */

angular.module('medviz')
    .config(function ($stateProvider)
    {
        'use strict';

        $stateProvider
            .state('medviz', {
                url:'',
                template:'<medviz-header></medviz-header><ui-view></ui-view><medviz-footer/>'
            })
            .state('medviz.client', {
                url:'/client',
                template:'<ui-view></ui-view>'
            })
            .state('medviz.client.login', {
                url:'/login',
                template:'<auth></auth>'
            })
            .state('medviz.client.agenda', {
                url:'/agenda',
                template:'<agenda></agenda>'
            })
            .state('medviz.client.visit', {
                url:'/visit',
                template:'<profile></profile><medviz-form></medviz-form>'
            })
            .state('medviz.client.submit', {
                url:'/submit',
                template:'<medviz-table>'
            })
            .state('medviz.admin', {
                url:'/admin',
                template:'<ui-view></ui-view>'
            })
            .state('medviz.admin.login', {
                url:'/login',
                template:'<auth></auth>'
            })
            .state('medviz.admin.dashboard', {
                url:'/dashboard',
                template:'<profile></profile><medviz-sections></medviz-sections><medviz-form></medviz-form><medviz-table></medviz-table><admin-ui></admin-ui>'
            })
            .state('medviz.landing', {
                url:'/landing',
                template:'<fold></fold><features></features><testimonials></testimonials>'
            })
            /* STATES-NEEDLE - DO NOT REMOVE THIS */;

    });
