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
        // ('doctors', newDoc);

	    // TODO refactor for all types, currently just doctors..
        function upload(type, list){
	        var uploadRef = dataRef.child(type);
	        var uploadData = $firebaseArray(uploadRef);
            var docCity = '';
            angular.forEach(list, function(doctor, key){
                if(doctor['DOCTOR NAME'].length > 2){
	                console.log('doctor: ',doctor['DOCTOR NAME']);
	                var newDoc = {};
	                  if (doctor.CITY.length > 2){
		                  console.log('city: ',doctor.CITY);
		                  docCity = doctor.CITY.toLowerCase();
                    }

                    angular.forEach(doctor, function(entry, key){
                        newDoc[key.toLowerCase()] = entry;
                        newDoc['city'] = docCity;
                    });
	                console.log('new doctor object: ',newDoc);
	                uploadData.$add(newDoc, function(error, data){
		                if(error){
			                console.log('blimey, somethings fucked in the uploading');
		                } else {
			                console.log('data',data);
		                }
	                });

                }
            })
         }
				// ('doctors',[{name:'doc spok', address:'123 lord road'},{'doctors',name:'doc spok2', address:'1234 lord road'}])

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
	          upload: upload,
            update: update,
            remove: remove
        };

        return service;
    });