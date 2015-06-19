/**
 * @ngdoc service
 * @name medviz.Data
 * @description
 * # Data
 * Factory in the medviz.
 */
angular.module('medviz')
    .factory('Data', function ($firebaseObject, $firebaseArray, Firebase)
    {
        'use strict';

        // INITIALIZATION
        var ref = new Firebase('https://medviz.firebaseio.com');
        var dataObject= $firebaseObject(ref);
        var dataArray=$firebaseArray(ref);
        var newModels = {
          users:{
            email:{val:'',type:'email'},
            name:{val:'', type:'text'},
            role:{val:'',type:'text'},
            agenda:{val:{
              schedule:{},
              tasks:{}
            }, type:'multi'}},
          visits:{
            time:{val: Date.now(),type:'number'},
            rep:{val:'',type:'text'},
            doctor:{val:'',type:'text'},
            notes:{val:'',type:'textarea'},
            drugs:{
              type:'multi-select',
              val:{drug:{val:'', type:'text'}, form:{val:'', type:'text'},qty:{val:0,type:'number'},units:{val:'', type:'text'}}},
            location:{
              type:'multi-select',
              val:{latitude:{val:0, type:'number'}}, longitude:{val:0, type:'number'}}
            },
          doctors:{
            address:{val:'',type:'text'},
            city:{val:'',type:'text'},
            'contact number':{val:0,type:'number'},
            'doctor name':{val:'',type:'text'},
            municipality:{val:'',type:'text'},
            'sector field':{val:'',type:'text'},
            speciality:{val:'',type:'text'}},
          drugs:{
            'brand name':{val:'',type:'text'},
            'chemical name':{val:'',type:'text'},
            'indications':{val:'',type:'text'},
            'summary':{val:'',type:'text'}}
          };


        // ACTUAL DEFINITION
        var service = {
            ref: ref,
            dataObject: dataObject,
            dataArray: dataArray,
            newModels:newModels
        };

        return service;
    });
