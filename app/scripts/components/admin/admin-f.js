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
        var uploadArray = [
            {
                "FIELD1":1,
                "ZONE":"",
                "CITY":"Aataouia",
                "MUNICIPALITY":"Aataouia",
                "DOCTOR NAME":"Id Ahmad Hicham",
                "SPECIALITY":"MG",
                "SECTOR FIELD":"HOPITAL LOCAL ATTAOUI",
                "ADDRESS":"",
                "CONTACT NUMBER":""
            },
            {
                "FIELD1":null,
                "ZONE":"",
                "CITY":"",
                "MUNICIPALITY":"",
                "DOCTOR NAME":"Laaroussi Nadia",
                "SPECIALITY":"MG (Urgences) ",
                "SECTOR FIELD":"HOPITAL LOCAL ATTAOUI",
                "ADDRESS":"",
                "CONTACT NUMBER":""
            },
            {
                "FIELD1":null,
                "ZONE":"",
                "CITY":"",
                "MUNICIPALITY":"",
                "DOCTOR NAME":"Laglaoui Aicha",
                "SPECIALITY":"MG (Urgences) ",
                "SECTOR FIELD":"HOPITAL LOCAL ATTAOUI",
                "ADDRESS":"",
                "CONTACT NUMBER":""
            },
            {
                "FIELD1":null,
                "ZONE":"",
                "CITY":"",
                "MUNICIPALITY":"",
                "DOCTOR NAME":"Lahmidi Salwa",
                "SPECIALITY":"MG",
                "SECTOR FIELD":"HOPITAL LOCAL ATTAOUI",
                "ADDRESS":"",
                "CONTACT NUMBER":""
            },
            {
                "FIELD1":null,
                "ZONE":"",
                "CITY":"",
                "MUNICIPALITY":"",
                "DOCTOR NAME":"Lemdilki Fatna",
                "SPECIALITY":"MG",
                "SECTOR FIELD":"HOPITAL LOCAL ATTAOUI",
                "ADDRESS":"",
                "CONTACT NUMBER":""
            },
            {
                "FIELD1":null,
                "ZONE":"",
                "CITY":"",
                "MUNICIPALITY":"",
                "DOCTOR NAME":"Lemkhanet Ilham",
                "SPECIALITY":"MG",
                "SECTOR FIELD":"HOPITAL LOCAL ATTAOUI",
                "ADDRESS":"",
                "CONTACT NUMBER":""
            },
            {
                "FIELD1":null,
                "ZONE":"",
                "CITY":"",
                "MUNICIPALITY":"",
                "DOCTOR NAME":"Mahboub",
                "SPECIALITY":"MG (Urgences) ",
                "SECTOR FIELD":"HOPITAL LOCAL ATTAOUI",
                "ADDRESS":"",
                "CONTACT NUMBER":""
            },
            {
                "FIELD1":null,
                "ZONE":"",
                "CITY":"",
                "MUNICIPALITY":"",
                "DOCTOR NAME":"Mouti Amina",
                "SPECIALITY":"MG ",
                "SECTOR FIELD":"HOPITAL LOCAL ATTAOUI",
                "ADDRESS":"",
                "CONTACT NUMBER":""
            },
            {
                "FIELD1":null,
                "ZONE":"",
                "CITY":"",
                "MUNICIPALITY":"",
                "DOCTOR NAME":"Touriki Youssef",
                "SPECIALITY":"MG ",
                "SECTOR FIELD":"HOPITAL LOCAL ATTAOUI",
                "ADDRESS":"",
                "CONTACT NUMBER":""
            },
            {
                "FIELD1":null,
                "ZONE":"",
                "CITY":"",
                "MUNICIPALITY":"",
                "DOCTOR NAME":"Ouajou Meriem",
                "SPECIALITY":"MG ",
                "SECTOR FIELD":"CENTRE DE SANTE ATTAOUIA",
                "ADDRESS":"",
                "CONTACT NUMBER":""
            },
            {
                "FIELD1":null,
                "ZONE":"",
                "CITY":"",
                "MUNICIPALITY":"",
                "DOCTOR NAME":"Tirizite Naima",
                "SPECIALITY":"MG ",
                "SECTOR FIELD":"CENTRE DE SANTE ATTAOUIA",
                "ADDRESS":"",
                "CONTACT NUMBER":""
            },
            {
                "FIELD1":null,
                "ZONE":"",
                "CITY":"",
                "MUNICIPALITY":"",
                "DOCTOR NAME":"",
                "SPECIALITY":"MG ",
                "SECTOR FIELD":"CENTRE DE SANTE ATTAOUIA",
                "ADDRESS":"",
                "CONTACT NUMBER":""
            },
            {
                "FIELD1":null,
                "ZONE":"",
                "CITY":"",
                "MUNICIPALITY":"",
                "DOCTOR NAME":"",
                "SPECIALITY":"",
                "SECTOR FIELD":"",
                "ADDRESS":"",
                "CONTACT NUMBER":""
            },
            {
                "FIELD1":2,
                "ZONE":"",
                "CITY":"AFOURAR ",
                "MUNICIPALITY":"AFOURAR ",
                "DOCTOR NAME":"El Aidi Zineb",
                "SPECIALITY":"MG ",
                "SECTOR FIELD":"CENTRE DE SANTE AFOURAR",
                "ADDRESS":"",
                "CONTACT NUMBER":""
            },
            {
                "FIELD1":null,
                "ZONE":"",
                "CITY":"",
                "MUNICIPALITY":"",
                "DOCTOR NAME":"El Khaldi Mustapha",
                "SPECIALITY":"MG ",
                "SECTOR FIELD":"CENTRE DE SANTE AFOURAR",
                "ADDRESS":"",
                "CONTACT NUMBER":""
            },
            {
                "FIELD1":null,
                "ZONE":"",
                "CITY":"",
                "MUNICIPALITY":"",
                "DOCTOR NAME":"Najim Ahmed",
                "SPECIALITY":"MG ",
                "SECTOR FIELD":"CENTRE DE SANTE AFOURAR",
                "ADDRESS":"",
                "CONTACT NUMBER":""
            },
            {
                "FIELD1":null,
                "ZONE":"",
                "CITY":"",
                "MUNICIPALITY":"",
                "DOCTOR NAME":"Ezzahiri",
                "SPECIALITY":"MG ",
                "SECTOR FIELD":"CENTRE DE SANTE TIMOULILT ",
                "ADDRESS":"",
                "CONTACT NUMBER":""
            },
            {
                "FIELD1":null,
                "ZONE":"",
                "CITY":"",
                "MUNICIPALITY":"",
                "DOCTOR NAME":"",
                "SPECIALITY":"",
                "SECTOR FIELD":"",
                "ADDRESS":"",
                "CONTACT NUMBER":""
            },
            {
                "FIELD1":3,
                "ZONE":"",
                "CITY":"AGADIR",
                "MUNICIPALITY":"CENTRE VILLE",
                "DOCTOR NAME":"Abadi Karim",
                "SPECIALITY":"MG ",
                "SECTOR FIELD":"CABINET PRIVE",
                "ADDRESS":"AV , MARRAKECH ",
                "CONTACT NUMBER":""
            },
            {
                "FIELD1":null,
                "ZONE":"",
                "CITY":"",
                "MUNICIPALITY":"CENTRE VILLE",
                "DOCTOR NAME":"Abadi Laila",
                "SPECIALITY":"",
                "SECTOR FIELD":"CABINET PRIVE",
                "ADDRESS":"Rue de Marrakech , Imm ACHROUK",
                "CONTACT NUMBER":""
            },
            {
                "FIELD1":null,
                "ZONE":"",
                "CITY":"",
                "MUNICIPALITY":"Talborjt",
                "DOCTOR NAME":"Abassor Aicha",
                "SPECIALITY":"",
                "SECTOR FIELD":"CABINET PRIVE",
                "ADDRESS":"34, Rue Ibn Toumart",
                "CONTACT NUMBER":""
            }
        ];

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

        (function uploadDocs(){
            var uploadRef = dataRef.child('test');
            var docCity = '';
            angular.forEach(uploadArray, function(doctor, key){
                if(doctor['DOCTOR NAME'].length > 0){
                    if (doctor.CITY.length > 0){
                        docCity = doctor.CITY.toLowerCase();
                    }
                    var newDoc = {};
                    angular.forEach(doctor, function(entry, key){
                        newDoc[key.toLowerCase()] = entry;
                        newDoc.city = docCity;
                        var uploadRef = dataRef.child('doctors');
                        var uploadArray = $firebaseArray(uploadRef);
                        uploadArray.$add(newDoc, function(error, data){
                            if(error){
                                console.log('blimey, somethings fucked in the uploading');
                            } else {
                                console.log(data);
                            }
                        });
                    })

                }
            })
         })();

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