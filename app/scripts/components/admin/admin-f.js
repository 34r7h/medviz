/**
 * @ngdoc service
 * @name medviz.Admin
 * @description
 * # Admin
 * Factory in the medviz.
 */
angular.module('medviz')
    .factory('Admin', function (Firebase, Data, $firebaseObject, $firebaseArray)
    {
        'use strict';

        // INITIALIZATION
        var dataRef = Data.ref;
        var dataArray = $firebaseArray(dataRef);
        console.log('Admin Factory Injected With: ',arguments);

        function create(type, props){
            var createRef = dataRef.child(type);
            var createArray = $firebaseArray(createRef);
            createArray.$add(props);
            // TODO add to index
        }
        // ('users', {name:'name', role:'admin'});

        function update(type, id, ob){
            var updateRef = dataRef.child(type);
            updateRef = updateRef.child(id);
            var updateObject = $firebaseObject(updateRef);
            updateObject.$value = ob;
            updateObject.$save();
            // TODO update index
        }
        //('users','-JpOhiJ7c6BDktXbqre0', {email:'email', name:'name'});

        function remove(type, id){
            var removeRef = dataRef.child(type);
            removeRef = removeRef.child(id);
            var removeObject = $firebaseObject(removeRef);
            removeObject.$remove();
        }
        //('users','-JpQE_p5eEk8fKXUuCFU');

        // ACTUAL DEFINITION
        var service = {
            create: create,
            update: update,
            remove: remove
        };

        return service;
    });