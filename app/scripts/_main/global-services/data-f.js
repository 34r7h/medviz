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
            role:{val:'',type:'text'}},
          visits:{
            time:{val: Date.now(),type:'number'},
            rep:{val:'',type:'text'},
            doctor:{val:'',type:'text'},
            drugs:{
              type:'multi-select',
              val:{name:{val:'', type:'text'},amount:{val:0,type:'number'}}},
            location:{val:'', type:'text'}},
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
