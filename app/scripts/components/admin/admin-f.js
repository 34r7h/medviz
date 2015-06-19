/**
 * @ngdoc service
 * @name medviz.Admin
 * @description
 * # Admin
 * Factory in the medviz.
 */
angular.module('medviz')
    .factory('Admin', function (Firebase, Data, $firebaseObject, $firebaseArray, $window, $rootScope, $timeout)
    {
        'use strict';

        // INITIALIZATION

        var dataRef = Data.ref;
        var dataArray = $firebaseArray(dataRef);
        console.log('Admin Factory Injected With: ',arguments);
        var cLoc;
        $timeout(function(){
            var geolocation = $window.navigator.geolocation;
            geolocation = geolocation.getCurrentPosition(function(position){
                cLoc = [position.coords.latitude, position.coords.longitude];
                console.log('position', cLoc);
                $rootScope.loc = cLoc;
            });
        },1000);

        var cTime = Date.now();

        function cleanString(str){
            var cleanStr = str.toLowerCase().replace(/'+/g, '').replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "-").replace(/^-+|-+$/g, '');
            return cleanStr;
        }

        function create(type, props){
            console.log('///////////////// Creating '+ type + ' Entry', props);
            props.location = {latitude:$rootScope.loc[0],longitude:$rootScope.loc[1]};
            props.time = cTime;
            console.log('props',props);
            var createRef = dataRef.child(type);
            var updateIndexRef = dataRef.child('index/'+type);
            var createArray = $firebaseArray(createRef);
            var updateIndexData = $firebaseArray(updateIndexRef);
            createArray.$add(props).then(function(ref) {
                var id = ref.key();
                console.log("added record with id " + id);
                angular.forEach(props, function(prop, key){
                    console.log(key, prop);
                    if(prop && prop.length>2){
                        var cleanProp = cleanString(prop);
                        var updateIndex = updateIndexRef.child(key+'/'+cleanProp);
                        var createObject = $firebaseObject(updateIndex);
                        createObject[id]=true;
                        console.log('createObject',createObject);
                        createObject.$save().then(function(ref) {
                            console.log('ref',ref); // true
                        });
                        //updateIndexRef.child(key+'/'+cleanProp).push(id);
                    }
                });
                console.log('//////////////// end create '+type+' entry');

            });
        }
        // ('doctors', newDoc);
	    // TODO refactor for all types, currently just doctors..
        function upload(type, list){
	        var uploadRef = dataRef.child(type);
	        var uploadIndexRef = dataRef.child('index/'+type);
	        var uploadData = $firebaseArray(uploadRef);
	        var uploadIndexData = $firebaseArray(uploadIndexRef);
            console.log(uploadIndexData);
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
	                uploadData.$add(newDoc).then(function(ref) {
                      var id = ref.key();
                      console.log("added record with id " + id);
                      angular.forEach(newDoc, function(prop, key){
                          if(prop && prop.length>2){
                              var cleanProp = prop.toLowerCase().replace(/'+/g, '').replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "-").replace(/^-+|-+$/g, '');
                              uploadIndexRef.child(key+'/'+cleanProp).push(id);
                          }
                      });
                  });
                }
            })
         }


        //('users','-JpOhiJ7c6BDktXbqre0', {email:'email', name:'name'});
        function remove(type, id){
            var removeRef = dataRef.child(type);
            removeRef = removeRef.child(id);
            var removeObject = $firebaseObject(removeRef);
            removeObject.$remove();
        }
        //('users','-JpQE_p5eEk8fKXUuCFU');
        // TODO also remove all from index

        function update(type, id, ob, oIndex){
            angular.forEach(arguments, function(arg, i){
                console.log('update arg: '+i, arg);
            });
            var updateRef = dataRef.child(type);
            updateRef = updateRef.child(id);
            var updateIndexRef = dataRef.child('index/'+type);
            var updateObject = $firebaseObject(updateRef);
            var updateIndexRefObject = $firebaseObject(updateIndexRef);

            console.log('updateIndexRefObject',updateIndexRefObject);
            console.log('updateObject',updateObject);
            updateObject.$value = ob;
            updateObject.$save().then(function(ref) {
                var id = ref.key();
                console.log("added record with id " + id);
                angular.forEach(ob, function(prop, key){
                    if(prop && prop.length>2){
                        console.log('prop',prop);
                        var cleanProp = cleanString(prop);
                        var updateIndex = updateIndexRef.child(key+'/'+cleanProp);
                        var createObject = $firebaseObject(updateIndex);
                        createObject[id]=true;

                        createObject.$save().then(function(ref) {
                            console.log('ref key',ref.key());
                            console.log('original index: ', oIndex[key]);
                            if(prop !== oIndex[key]){
                                console.log('indexed things to erase',key, oIndex[key]);
                                console.log('indexed place to erase',updateIndexRef.child(key + '/' + oIndex[key]));
                                var removeOldIndex = updateIndexRef.child(key+'/'+oIndex[key]);
                                var removeObject = $firebaseObject(removeOldIndex);
                                removeObject.$remove();

                            }
                        });

                    }
                });
            });


            // TODO update index
        }

        function refreshAddNewModel(model, newModel){
            newModel = {};
            angular.forEach(model, function(prop, key){
                newModel[key]=prop.val;
            });
        }

        // ACTUAL DEFINITION
        var service = {
            create: create,
	          upload: upload,
            update: update,
            remove: remove,
            refreshAddNewModel: refreshAddNewModel
        };

        return service;
    });