/**
 * @ngdoc overview
 * @name medviz
 * @description
 * # medviz
 *
 * Main module of the application.
 */
angular.module('medviz', [
    'ngAnimate',
    'ngAria',
    'ngResource',
    'ui.router',
    'foundation',
    'firebase'
  ]);

/**
 * @ngdoc overview
 * @name medviz.routes
 * @description
 * # medviz.routes
 *
 * Routes module. All app states are defined here.
 */

angular.module('medviz')
	.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
		'use strict';

		$stateProvider
			.state('medviz', {
				url: '',
				abstract: true,
				template: '<medviz-header></medviz-header>' +
				'<div ui-view ></div>' +
				'<medviz-footer></medviz-footer>',
				controller: ["$scope", "$state", "Data", function($scope, $state, Data){
					$scope.view = {};
					$scope.ctrlData = Data.test;
					$scope.view.section='';
					$scope.view.view=$state.params.view;


				}]
			})
			.state('medviz.landing', {
				url: '/',
				template: '<landing></landing>',
				controller: ["$scope", function($scope){}]
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
	}]);

/**
 * @ngdoc service
 * @name medviz.Api
 * @description
 * # Api
 * Factory in the medviz.
 */
angular.module('medviz')
    .factory('Api', ["Auth", "Admin", "Client", function (Auth, Admin, Client)
    {
        'use strict';

        // INITIALIZATION

    // Function Definitions
	    console.log('API Factory Injected With: ',arguments);

	    //function reloadState() {$state.go($state.current, {}, {reload: true});}

        // ACTUAL DEFINITION
        var service = {
            login: Auth.login,
            logout: Auth.logout,
            authCheck: Auth.authCheck,
	          newUser: Auth.newUser,
            create: Admin.create,
            upload: Admin.upload,
            update: Admin.update,
            remove: Admin.remove,
            newVisit: Client.newVisit

        };

        return service;
    }]);
/**
 * @ngdoc service
 * @name medviz.Data
 * @description
 * # Data
 * Factory in the medviz.
 */
angular.module('medviz')
    .factory('Data', ["$firebaseObject", "$firebaseArray", "Firebase", function ($firebaseObject, $firebaseArray, Firebase)
    {
        'use strict';

        // INITIALIZATION
        var ref = new Firebase('https://medviz.firebaseio.com');
        var dataObject= $firebaseObject(ref);
        var dataArray=$firebaseArray(ref);


        // ACTUAL DEFINITION
        var service = {
            ref: ref,
            dataObject: dataObject,
            dataArray: dataArray
        };

        return service;
    }]);

'use strict';

/**
* @ngdoc directive
* @name medviz.directive:admin
* @description
* # admin
*/
angular.module('medviz')
.directive('admin', function ()
{
    return {
        templateUrl: 'scripts/components/admin/admin-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: ["$scope", "Admin", function ($scope, Admin)
        {

        }]
    };
});
/**
 * @ngdoc service
 * @name medviz.Admin
 * @description
 * # Admin
 * Factory in the medviz.
 */
angular.module('medviz')
    .factory('Admin', ["Firebase", "Data", "$firebaseObject", "$firebaseArray", function (Firebase, Data, $firebaseObject, $firebaseArray)
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
				 /*('doctors',
           [
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
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"CENTRE VILLE",
                   "DOCTOR NAME":"Abbassi M'hamed",
                   "SPECIALITY":"URO ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Rue Hôtel de Ville , Imm JAMAL",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Abchar Aziz",
                   "SPECIALITY":"MG ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"21, Rue Hôtel de ville Imm Jamal ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Abchar.a",
                   "SPECIALITY":"CHIR",
                   "SECTOR FIELD":"CLINIQUE SOUSS",
                   "ADDRESS":" Av Abderrahim Bouabid ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Abdoulilah Nassila",
                   "SPECIALITY":"DERM",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"2, Angle Rue El Bekkay & Marrakech",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Abia Abdeslam",
                   "SPECIALITY":"ORL",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"2, AV My Abellah",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Aboulazhar Driss",
                   "SPECIALITY":"OPHTAL",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"51 bis , Av 29 Fevrier",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Abouziad El Habib",
                   "SPECIALITY":"MG ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"13 , Av Abderrahim Bouabid",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Aderdour Rkia",
                   "SPECIALITY":"MG ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"97, Rue de Meknes bloc 4",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Adnane",
                   "SPECIALITY":"MG ",
                   "SECTOR FIELD":"POLYCLINIQUE C.N.S.S",
                   "ADDRESS":"Rue My Youssef",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Aissaoui",
                   "SPECIALITY":"GAST",
                   "SECTOR FIELD":"POLYCLINIQUE C.N.S.S",
                   "ADDRESS":"Rue My Youssef",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Anouar Salek",
                   "SPECIALITY":"RADIO",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av Hassan II Imm Mayouhel",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Hay En-Nahda",
                   "DOCTOR NAME":"Arjdal M'barek",
                   "SPECIALITY":"NEURO",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"29, Av My Ismail Rue Ibn Abad",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Talborjt",
                   "DOCTOR NAME":"Arrom Mohamed",
                   "SPECIALITY":"ANESTH-REANI",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"10,Av My ismail ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Massira",
                   "DOCTOR NAME":"Atbir Mohamed",
                   "SPECIALITY":"GAST",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"47, Rue Sidi Oulhadj",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Quartier Sidi Mohamed",
                   "DOCTOR NAME":"Atlab Nouressaid",
                   "SPECIALITY":"MG ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"40, Av Jamal Abdennacer ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Attaf Mustapha",
                   "SPECIALITY":"CHIR",
                   "SECTOR FIELD":"Clinique TILILA ",
                   "ADDRESS":"Rue Oujjaj",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Ayyadi Omar",
                   "SPECIALITY":"MG ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"POLYCLINIQUE C.N.S.S",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Bahij Driss",
                   "SPECIALITY":"CHIR",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"17 Av Hassan II , Imm Oumlil",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Bakkouch Abderrahmane",
                   "SPECIALITY":"TRAUM-ORTHO",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"18, Av Hassan II Imm Oumlil ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Bassieres Xaavier Francois",
                   "SPECIALITY":"OPHTAL",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"325 , Av Hassan II Imm KABBAJ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":" Belaakoul Rajaa",
                   "SPECIALITY":"NEPHRO",
                   "SECTOR FIELD":"POLYCLINIQUE C.N.S.S",
                   "ADDRESS":"Rue My Youssef",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Talborjt",
                   "DOCTOR NAME":"Belhadj Haddou Naima",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Rue 29 Fevrier Imm Guermai",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Belhaj Abdelmajid",
                   "SPECIALITY":"CARDIO",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av My Abdellah , Imm .M1",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Belhaj H.naima",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Rue 29 Fevrier , Imm GUERMANE ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Talborjt",
                   "DOCTOR NAME":"Belkebir Mrani Abderrahmane",
                   "SPECIALITY":"RHUMATO",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"102 , Av John KENNEDY",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Belkhayat Samir",
                   "SPECIALITY":"MG ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Place des Taxis",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Bella Ahmed",
                   "SPECIALITY":"OPHTAL",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"50 , Rue M'Haned Nait Taleb",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Ben Mahfoud Jawad",
                   "SPECIALITY":"OPHTAL",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Bd El Bekkay & Marrakech ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Quartier Sidi Mohamed",
                   "DOCTOR NAME":"Benabdelkrim El Filali Sabah",
                   "SPECIALITY":"PEDIATRES",
                   "SECTOR FIELD":"Clinique TILILA",
                   "ADDRESS":"Rue Oujjaj",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Benabdelwahad Abdelhamid",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av My Abdellah Imm Annasr ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Benhida Mohamed",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"Clinique ONE",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Benhoumaida Khadija",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"62 ,Bloc C Khaima II",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Benjelloun El Mustapha",
                   "SPECIALITY":"CARDIOLO ",
                   "SECTOR FIELD":"POLYCLINIQUE C.N.S.S ",
                   "ADDRESS":" Rue My Youssef",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Benlarbi Raja",
                   "SPECIALITY":"PEDIATRES ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"1, Rue Marrakech",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Bennani Abdelhamid",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"2 , Rue Hôtel de ville",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Bensaleh Younes",
                   "SPECIALITY":"DERMATO",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"RUE HÔTEL DE VILLE IMM SAADANI",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Bensalem Abdeljabbar",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"POLYCLINIQUE C.N.S.S ",
                   "ADDRESS":" Rue My Youssef",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Bensennane Laila",
                   "SPECIALITY":"BIOLOGIES ",
                   "SECTOR FIELD":"POLYCLINIQUE C.N.S.S ",
                   "ADDRESS":" Rue My Youssef",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Bentoujda Said",
                   "SPECIALITY":"GASTRO-ENT",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"3 , Av My Abdellah Imm M2 ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Berrada Ahmed Najib",
                   "SPECIALITY":"GYNECO-OBSTE ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av My Abdellah , Imm M1",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Talborjt ",
                   "DOCTOR NAME":"Biga Mohamed",
                   "SPECIALITY":"ENDOC-DIABET",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"1, Av ,29 Fevrier Imm Guermane ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Talborjt ",
                   "DOCTOR NAME":"Bizrane Mohamed",
                   "SPECIALITY":"CHIR-URO ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"35 , Rue Mehdi Ben Toumaret",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Bouchiba Mohamed Fouzi",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"POLYCLINIQUE C.N.S.S ",
                   "ADDRESS":" Rue My Youssef",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Bouchra Najib",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"POLYCLINIQUE C.N.S.S ",
                   "ADDRESS":" Rue My Youssef",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Boufdil Mohamed",
                   "SPECIALITY":"OPHTAL ",
                   "SECTOR FIELD":"POLYCLINIQUE C.N.S.S ",
                   "ADDRESS":" Rue My Youssef",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Boujelal Redouane",
                   "SPECIALITY":"MG ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"100 , Av Imame Al Boukhari, Ouargane",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Talborjt ",
                   "DOCTOR NAME":"Boujja Houcine",
                   "SPECIALITY":"CARDIOLO ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Rue de l'Entraide ,Nx",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"CITÉ DAKHLA ",
                   "DOCTOR NAME":"Boukaidi Abdellah",
                   "SPECIALITY":"GASTRO-ENT",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"43, AV HASSAN 1ER , IMMEUBLE AMAL SOUSS",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Hay esslam",
                   "DOCTOR NAME":"Boukkadi Abdelilah",
                   "SPECIALITY":"MG ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Imm BSSITA ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Talborjt ",
                   "DOCTOR NAME":"Boulhouda My Ahmed",
                   "SPECIALITY":"ORL ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"183 , Av My Abdellah",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Cite Dakhla",
                   "DOCTOR NAME":"Bouthirit Said",
                   "SPECIALITY":"CHIR-VISCE",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Cite Dakhla",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Boutti Abdellah",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"BP : 5393 Q.I ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Bouziane Ouaritini Mohamed",
                   "SPECIALITY":"PNEUMO-PHTIS ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"123 , Imm Achtouk 1er Et , Rue Marrakech , BP : 788 ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Bram Georges",
                   "SPECIALITY":"CHIR-VISCE",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av Hassan II Imm Assoulil",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Camara Amirou",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":" 124 , Rue d'Oujda ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"QUART INDUST",
                   "DOCTOR NAME":"Chahed El Hassan",
                   "SPECIALITY":"MG ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"2 , RUE DU 2 MARS , ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Chahed Hassan",
                   "SPECIALITY":"MG ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"2, Angle Av Abderrahim Bouabid & Av 2 Mars",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Chami Mustapha",
                   "SPECIALITY":"RADIOLO",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"20 , Rue de La foire Imm Fadoukhir ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Charef Mohamed Aziz",
                   "SPECIALITY":"RHUMATO ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"271 , Bd Hassan II ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Cheguer Hassan",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"7, Rue de Marrakech ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Cherkaoui Mohamed Farouk",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Angle Av Prince My Abdellah & Rue Hôtel de ville",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Compos Dominique",
                   "SPECIALITY":"DERMATO ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Rue Hôtel de Ville",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Dissani Abderrahim",
                   "SPECIALITY":"ORL ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"255 , Av Hassan II ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Quartier Indust",
                   "DOCTOR NAME":"D'khissy Leila",
                   "SPECIALITY":"DERMATO ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Imm Bakrim",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Eddayab Mohamed",
                   "SPECIALITY":"CHIR-VISCE ",
                   "SECTOR FIELD":"Clinique Al Massira ",
                   "ADDRESS":"Av My Abdellah",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Khiams",
                   "DOCTOR NAME":"El Adaoui Souad",
                   "SPECIALITY":"MG ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"100 , Av Imame El Boukhari ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"El Alaoui Benchad My Youssef",
                   "SPECIALITY":"PNEUMO-PHTIS",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"2, Bd John KENNEDY Rue Ifni ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"El Alaoui Najat",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Angle Av Hassan II , Rés Borj dialte",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Talbirjt",
                   "DOCTOR NAME":"El Ayoubi Abdelali",
                   "SPECIALITY":"DERMATO",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"62, Rue Fal Ouled Oumeir",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Talbirjt",
                   "DOCTOR NAME":"El Baroudi Saad",
                   "SPECIALITY":"CHIR-URO",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av du 29 Février ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"El Blidi Saida",
                   "SPECIALITY":"GASTRO-ENT",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Angle Av Hassan II & Abderrahim Bouabid , Rés Borj Dlalate",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"El Hachoumi Driss",
                   "SPECIALITY":"CHIR-INF",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"7 , Place des Taxis Imm Bakrim",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"El Jirari Abderrahim",
                   "SPECIALITY":"ORL ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"23 Av Hassan II Imm Oumlil ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Quartier Indust",
                   "DOCTOR NAME":"El Mortaji El Hassan",
                   "SPECIALITY":"GASTRO-ENT",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Rue de Marrakech , N° 57/59 ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"El Mrini Jamila",
                   "SPECIALITY":"GASTRO-ENT",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av Hassan II , Berj Dllalt",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"El Ouarzazi Jamila",
                   "SPECIALITY":"PEDIATRES ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Place des Taxis Imm ZOHOR",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Talborjt ",
                   "DOCTOR NAME":"Ennour-idrissi Mohamed",
                   "SPECIALITY":"ANATOMO-PATH",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Rue 29 Fervrier",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Er-rachidi Omar",
                   "SPECIALITY":"ANESTH-REANI",
                   "SECTOR FIELD":"POLYCLINIQUE C.N.S.S",
                   "ADDRESS":"Rue My Youssef",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Errami Mohamed Lakber",
                   "SPECIALITY":"PNEUMO-PHTIS",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Rue Hôtel de Ville , Imm IMOURANE",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Es-serfati Sabah",
                   "SPECIALITY":"MG ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"120, Rue de Meknes",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Ezzine Abdeljabar",
                   "SPECIALITY":"PSYCHIA ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"32 bis , Rue Sidi Bouknadel ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Talborjt ",
                   "DOCTOR NAME":"Fadlouallah Omar",
                   "SPECIALITY":"TRAUM-ORTHO",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Imm ANOUAR Rue du 29 Fevrier",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":" Fassi Fihri Najib",
                   "SPECIALITY":"RHUMATO",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"7, Av My Abdellah Imm SABRINE",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Fnini Salah",
                   "SPECIALITY":"ORL ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Angle Rue Marrakech & Pt Bekkay",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Fouissi Abderrahim",
                   "SPECIALITY":"MG ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"131 , Av Omar Ibnou Al Khattab",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Frah Belaid",
                   "SPECIALITY":"RADIOLO ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av Hassan II Imm Mayouhel ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Quart Indust ",
                   "DOCTOR NAME":"Ghailane Said",
                   "SPECIALITY":"MG-DIABETO ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"65 , Bd Ghandi , Cité DAKHLA BP : 8230",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Gourram Mohamed",
                   "SPECIALITY":"OPHTAL ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"79 ,Av El Moukawama Bloc 1",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Gourram Mohamed",
                   "SPECIALITY":"OPHTAL ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Angle Bd El Bekkay et Lot TIDLI",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Gourram Mokhtar",
                   "SPECIALITY":"RADIOLO ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av Moukawama Imm HAMRIA ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Grih Hamid",
                   "SPECIALITY":"CHIR-INF ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"5, Av Hassan II Imm Oumlil",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Hachimi Hassan",
                   "SPECIALITY":"ANESTH-REANI",
                   "SECTOR FIELD":"CLINIQUE SOUSS",
                   "ADDRESS":"AV ABDERRAHIM BOUABID",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Khiams",
                   "DOCTOR NAME":"Haddi Mehdi",
                   "SPECIALITY":"MG ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"30, Rue El Hammame , Nx",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Hakam Khalid",
                   "SPECIALITY":"MG ",
                   "SECTOR FIELD":"POLYCLINIQUE C.N.S.S ",
                   "ADDRESS":"Rue My Youssef",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Hamelin Paul Marcel",
                   "SPECIALITY":"CHIR-VISCE",
                   "SECTOR FIELD":"CLINIQUE La Residance",
                   "ADDRESS":"34 , Rue mehdi Ben Toumeret",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Hamzaoui Mohamed",
                   "SPECIALITY":"CHIR-NEURO",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"25, Av Hassan II , Imm Oumlil",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Talborjt ",
                   "DOCTOR NAME":"Hay Ali Abdelali",
                   "SPECIALITY":"RADIOLO",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Imm ACHAR",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Hayou Mohamed",
                   "SPECIALITY":"ORL ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Place des Taxis Imm Bakrim",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Talborjt",
                   "DOCTOR NAME":"Homri Ali",
                   "SPECIALITY":"DERMATO ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av ,29 Fevrier  Imm Guermane .",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Idelcadi Abdelghani",
                   "SPECIALITY":"MG ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"283, Av Hassan II",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Talborjt",
                   "DOCTOR NAME":"Idhajji Aberrahim",
                   "SPECIALITY":"OPHTAL ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Imm Asslam n° 27 , Av Cheikh Saadi",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":" Idlkadi",
                   "SPECIALITY":"CHIR-INF",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"AV HASSAN II ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Jaaber Abderrahim",
                   "SPECIALITY":"CHIR-URO ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av Mrd Cheikh Saadi , Imm Sarour N°2",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Jaafari Khalid",
                   "SPECIALITY":"OPHTAL ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"AV Hassan II , Imm assoulil ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Jabir Bouchiab",
                   "SPECIALITY":"PEDIATRES ",
                   "SECTOR FIELD":"POLYCLINIQUE C.N.S.S ",
                   "ADDRESS":" Rue My Youssef",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Jellouli Belaid",
                   "SPECIALITY":"CARDIOLO ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"25 Imm Assalam , 2ème Etage",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Jorge Abram",
                   "SPECIALITY":"CHIR-VISCE ",
                   "SECTOR FIELD":"CLINIQUE ASSOULIL",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Kadiri Touria",
                   "SPECIALITY":"ENDOC-DIABET",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":" Av My Abdellah Imm M1",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Kassab Said",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Angle Rue Marrakech & Pt El Bekkay , n° 1, Imm Oubidar",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Kebdani Abdekader",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av Hassan II , Imm Rachdi , 2ème etage n° 8 ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Khaoua M'hamed",
                   "SPECIALITY":"ORL ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"10 , Av My Ismail Imm TARIK ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Khiyati Mohamed",
                   "SPECIALITY":"CHIR-VISCE",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Rue El Bekkay , Imm KHALIDI",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Kimakh Naima",
                   "SPECIALITY":"ANESTH-REANI",
                   "SECTOR FIELD":"Clinique AGADIR",
                   "ADDRESS":"Av , Hassan II",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Komat Mourad",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"611, Av Med V Imm Errachad ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"QUART INUST",
                   "DOCTOR NAME":"Korchi Mohamed",
                   "SPECIALITY":"MG ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"3, AV DU 2 MARS",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Laghrabli Rachid",
                   "SPECIALITY":"ANESTH-REANI",
                   "SECTOR FIELD":"POLYCLINIQUE C.N.S.S",
                   "ADDRESS":"Rue My Youssef",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Lahlali Abdlilah",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"CLINIQUE MERE-ENFANT",
                   "ADDRESS":"Av Hassan II",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Lahlou Najiba",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"Clinique JIHANE",
                   "ADDRESS":"Av Cheikh Saâdi ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Dchira",
                   "DOCTOR NAME":"Lahlou Nour-eddine",
                   "SPECIALITY":"ORL ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":" Imm Afoulki",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Lahouibi",
                   "SPECIALITY":"PNEUMO-PHTIS",
                   "SECTOR FIELD":"POLYCLINIQUE C.N.S.S",
                   "ADDRESS":"Rue My Youssef",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Talborjt",
                   "DOCTOR NAME":"Laouini Saadia",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"25 ,Rue de l'Entraide Nationale",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Layassami Abdeilah",
                   "SPECIALITY":"ANESTH-REANI",
                   "SECTOR FIELD":"Clinique AGADIR",
                   "ADDRESS":" Av , Hassan II",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Layine Zineb",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"CLINIQUE MOKHTAR SOUSSI",
                   "ADDRESS":"-",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":" Lazerk Said",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"115, khiam II",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Lraqui Housseini Aziz",
                   "SPECIALITY":"NEPHRO",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"1, Av 29 Fevrier",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Maaouni Saadia",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Rue Entraide Nationale",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Azrou",
                   "DOCTOR NAME":"Mammad Hassan",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"1, Bloc 8 ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Marouan Ahmed",
                   "SPECIALITY":"CHIR-VISCE",
                   "SECTOR FIELD":"POLYCLINIQUE C.N.S.S",
                   "ADDRESS":"Rue My Youssef",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Martinez Espinoza",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Imm Oumlil Av Hassan II",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"M'bchour Mohamed",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av de Résistance ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Medina Mustapha Ahmed",
                   "SPECIALITY":"OPHTAL",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"2 ,Rue du Présendent El Bekkay ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Talborjt",
                   "DOCTOR NAME":"Mesdadi Saida",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av 29 Fevrier ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Messaoudi Hassan",
                   "SPECIALITY":"TRAUM-ORTHO",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"30, Rue de la Foire - Place des nations unies",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Morchid Abderrahim",
                   "SPECIALITY":"CHIR-URO ",
                   "SECTOR FIELD":"POLYCLINIQUE C.N.S.S",
                   "ADDRESS":"Rue My Youssef ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Morosova Antonina",
                   "SPECIALITY":"PEDIATRES",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"6, Av Allal Ben Abedellah",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Mouhid El Khadir",
                   "SPECIALITY":"PEDIATRES",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"19 ,Rue Pt El Bakkay",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Talborjt",
                   "DOCTOR NAME":"Mounib Bachir",
                   "SPECIALITY":"NEPHRO",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"10, Extention X",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Moussair Ahmed",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CLinique INBIAAT",
                   "ADDRESS":" Av HASSAN II",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Moustadraf Zouhair",
                   "SPECIALITY":"ENDOC-DIABET",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"RUE DE MARRAKECH",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Mousyir Ahmed",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"283, Av Hassan II Imm Al Massira",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Moutamassik Zakia",
                   "SPECIALITY":"OPHTAL",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"AV HASSAN II",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Nbou Abdeslam",
                   "SPECIALITY":"PEDIATRES ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"3 , Rue Damas",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Ouazzani Ahmed",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av My Ismail en Face d'Imm TARIK",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Outaleb Mohamed",
                   "SPECIALITY":"PNEUMO-PHTIS",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"18 , Rue Hôtel de Ville",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Ragragui Mohamed",
                   "SPECIALITY":"PNEUMO-PHTIS",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Place des Taxis Imm ACHAR ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Rami Yahyaoui Abdelfettah",
                   "SPECIALITY":"CARDIOLO",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Angle Rue Marrakech , Rue Massa ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Talborjt",
                   "DOCTOR NAME":"Riah Benyounes",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"6, Av Allal Ben Abdellah ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Ridouani Abdelkader",
                   "SPECIALITY":"CHIR-VISCE",
                   "SECTOR FIELD":"CLINIQUE MOKHTAR SOUSSI",
                   "ADDRESS":"-",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Rochd Mohamed",
                   "SPECIALITY":"CHIR-VISCE",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Ang Bd My Ismail Rue Al Koufa Imm TARIK",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Saadou Khalid",
                   "SPECIALITY":"GASTRO-ENT",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"8 , Place des Taxis Imm ZOHOUR ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Saber R'kia",
                   "SPECIALITY":"MG ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Angle Rue de Marrakech Lot TILDI",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Sadak Abdelaziz",
                   "SPECIALITY":"PSYCHIA",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"115, Extention X",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Samit Adnan",
                   "SPECIALITY":"MG ",
                   "SECTOR FIELD":"POLYCLINIQUE C.N.S.S ",
                   "ADDRESS":"Rue My Youssef ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Sayarh Abdelilah",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av Cheikh Saadi ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Sbai Said",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"22 ,av Cheikh Saadi Imm Asslam ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Sefraoui",
                   "SPECIALITY":"GASTRO-ENT",
                   "SECTOR FIELD":"POLYCLINIQUE C.N.S.S ",
                   "ADDRESS":"Rue My Youssef",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Talborjt",
                   "DOCTOR NAME":"Shaimed Saleh",
                   "SPECIALITY":"GASTRO-ENT",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"1, Av ,29 Fevrier - Imm Guermane ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Squali Hamzaoui Hassan",
                   "SPECIALITY":"RADIOLO ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"10, Av Hassan II Imm Oumlil ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Staira Mohamed",
                   "SPECIALITY":"ORL",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av Hassan II , Imm ASSOULIL 1ER ET",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Tadili Mohamed",
                   "SPECIALITY":"MG-DIABETO",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"13 ,Rue Président El bekkay",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Tadlaoui El Ouafi Abdelilah",
                   "SPECIALITY":"TRAUM-ORTHO ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av , 29 Fevrier , Place Grande Mosque",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Taleb Mohamed",
                   "SPECIALITY":"GASTRO-ENT",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"11 ,Rue de Hôtel du Ville Imm X2 ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Talborjt",
                   "DOCTOR NAME":"Tamim Zoubida",
                   "SPECIALITY":"ORL",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Imm GUERMANE",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Tantaoui Rachid",
                   "SPECIALITY":"RADIOLO ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av , 29 Fevrier Cité El Massira ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Temestet Raphael",
                   "SPECIALITY":"PEDIATRES",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"25,Place du Souss",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Temstet",
                   "SPECIALITY":"PEDIATRES",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Rue de Fes Place Souss ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Uakkas Abdelaziz",
                   "SPECIALITY":"CHIR-VISCE",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av , Hassa II ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Wifaq Malika",
                   "SPECIALITY":"MG ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"20 ,Rue 337 Quartier Amsirnat",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Talborjt ",
                   "DOCTOR NAME":"Zemare Haddou",
                   "SPECIALITY":"NEPHRO ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"10, Extention X ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Zerouali Abderrazak",
                   "SPECIALITY":"CHIR-NEURO",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"6, Rue Hotel de Ville , Imm JAMAL",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Ziadi Mustapha",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"POLYCLINIQUE C.N.S.S ",
                   "ADDRESS":"Rue My Youssef",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Zidani Larbi",
                   "SPECIALITY":"PEDIATRES",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"10,Rue Hôtel de Ville Imm Jamal",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Zihir Zakia",
                   "SPECIALITY":"PEDIATRES",
                   "SECTOR FIELD":"CLINIQUE MERE-ENFANT",
                   "ADDRESS":"Av Hassan II ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Aboufalou Zahra",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CENTRE DE SANTE AL QODS",
                   "ADDRESS":"-",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Aboussaad Hind",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CENTRE DE SANTE LAHMADT",
                   "ADDRESS":"-",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Allaoui Naima",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"-",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Amarouf Khadija",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CENTRE DE SANTE AMSERNAT ",
                   "ADDRESS":"-",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Amekrane Soumaya",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Azmy Jamila",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CENTRE DE SANTE AMSERNAT ",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Bachiri Lahcen",
                   "SPECIALITY":"CHIR-VISCE",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Bekkari Karima",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CENTRE DE SANTE QUAR.INDUSTRIEL",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Belhachemi Abdellah",
                   "SPECIALITY":"BIOLOGIES",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":" Belkadi Mohamed Said",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Bellemilih Abderrazzak",
                   "SPECIALITY":"CHIR-URO",
                   "SECTOR FIELD":"CENTRE DE DIAGNOSTIC HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":" Bellouch Mohamed",
                   "SPECIALITY":"CARDIOLO",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Belmlih",
                   "SPECIALITY":"CHIR-URO",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Iraki",
                   "SPECIALITY":"CHIR-PLAS",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Issioui El Mustapha",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Jama Abdekader",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Jaouahri Tissafi Naima",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CENTRE DE SANTE IHCHACHE",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Kajji Zaid",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Khatiri Abdelouhed",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Khelladi Hosni",
                   "SPECIALITY":"RADIOLO ",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Khrichfa",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"URGENCES HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Laaouina Zouhair",
                   "SPECIALITY":"CHIR-NEURO",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Labbassi",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Lagdani Abderrahman",
                   "SPECIALITY":"CHIR-NEURO",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Lahoubi M'barek",
                   "SPECIALITY":"PNEUMO-PHTIS",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Lariachi Mohamed Khalil",
                   "SPECIALITY":"PEDIATRES",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Leghzaoui Nora",
                   "SPECIALITY":"MG ",
                   "SECTOR FIELD":"CENTRE DE SANTE AMSERNAT",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Lotfi Soumya",
                   "SPECIALITY":"PNEUMO-PHTIS",
                   "SECTOR FIELD":" CENTRE DE DIAGNOSTIC HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Malmoussi Lahcen",
                   "SPECIALITY":"CHIR-INFECTIEUSES",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":" Tamir Rachida",
                   "SPECIALITY":"PNEUMO-PHTIS",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Tamri Youssef",
                   "SPECIALITY":"CHIR-NEURO",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Zahid Mohamed",
                   "SPECIALITY":"TRAUM-ORTHO",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Zahidi M'barek",
                   "SPECIALITY":"TRAUM-ORTHO",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Zahir Hanane",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Ziadi Rahim",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Zitouni Zakia",
                   "SPECIALITY":"NEPHRO ",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Zouhali Amina",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"CENTRE DE DIAGNOSTIC HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Zouin",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Zouyne Ahmed",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Zraidi",
                   "SPECIALITY":"RHUMATO",
                   "SECTOR FIELD":"HOPITAL HASSAN II",
                   "ADDRESS":"",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Laghrabli Hassane",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":" 1090 Imm Assoulil Av Hassan II ",
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
                   "FIELD1":4,
                   "ZONE":"",
                   "CITY":"AGOURAI",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Arkoub Mohamed",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"33, Av Massira",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":" El Bahja Noureddine",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"37, Av Hassan II , Agourai",
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
                   "FIELD1":5,
                   "ZONE":"",
                   "CITY":"AGUELMOUS",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Hajri Mohamed",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":" CENTRE VILLE",
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
                   "FIELD1":6,
                   "ZONE":"",
                   "CITY":"AHFIR",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Azzaoui Jaouad",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":" 6,Av Hassan II",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Bouhmidi Khalid",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"31, Bd Telemsane",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Daoudi Nadia",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"2, Rue El Fida Hay Aouatif",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Ghrabti Souad",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"75 , Bd Hassan II",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Rasdi Abdelkader",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"71, Rue Taghijirt",
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
                   "FIELD1":7,
                   "ZONE":"",
                   "CITY":"AIN ATIQ",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Mabrouk Rabha",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":" 2, Saffar",
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
                   "FIELD1":8,
                   "ZONE":"",
                   "CITY":"AIN BENI MATHAR",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Douhi Mohamed",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"2 ,Rue Figuig ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Issiali Hamid",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"94, Hay Ouhoud",
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
                   "FIELD1":9,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"AIN EL AOUDA",
                   "DOCTOR NAME":"El Alaoui Mrani Abdellah",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"CENTRE",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Nadim Zakaria",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"146 , Avenue Doukkala",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Sany Abdellatif",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"5 , Rue de Souk ",
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
                   "FIELD1":10,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"AIN HARROUDA",
                   "DOCTOR NAME":"Chatraoui Latifa",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"4 ,Rés Nasdihi",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"El Fares Aziz",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Km . 17 ,Centre",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Guessous Khaild",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"69 Lots Guessous ,Km 17",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Houry Mohamed Jamal",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"72 Lots Guessous. Km 17",
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
                   "FIELD1":11,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"AIN LEUH",
                   "DOCTOR NAME":"Zekraoui Driss",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"34, Bd Hassan II",
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
                   "FIELD1":12,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"AIN TAOUJDATE",
                   "DOCTOR NAME":"Badai Abdelmajid",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Rue Caïdat",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Megzari Youssef",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"120, Hay PAM II",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Rhazale Mohamed",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"70, Diour Jdad",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Sami Abdelali",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"126, Hay El Fath",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Zouzi Nezha",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"23 Diour Jdad ",
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
                   "FIELD1":13,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"AIT AMIRA",
                   "DOCTOR NAME":"Belkacem Majid",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Lot Choukair APP 1",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Boiua Abdemajid",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"CENTRE VILLE",
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
                   "FIELD1":14,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"AIT BAHA",
                   "DOCTOR NAME":"Essahibi Abdelaziz",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av Mohamed V Imm BAGHACH",
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
                   "FIELD1":15,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"AIT ISHAQ",
                   "DOCTOR NAME":"Meliani Mohamed Reda",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"CENTRE VILLE",
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
                   "FIELD1":16,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"AIT IZZA",
                   "DOCTOR NAME":"Belhamid Zohra",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"N° 38, Essalam , CENTRE DE VILLE",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Ben Addar Jamal-eddine",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Hay Essalam",
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
                   "FIELD1":17,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"AIT MELLOUL",
                   "DOCTOR NAME":" Akil Abderrahmane",
                   "SPECIALITY":"PEDIATRES",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Route, Tiznit, Imm BICHARA",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Boutaam L'houcine",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Route de Tiznit, Imm JOUMANI",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":" El Attir Mina",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Route Biougra, Imm DAMOU",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"El Ghanimi Aicha",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"KM , 1 RTE , BIOUGRA",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"El Housni El Hassan",
                   "SPECIALITY":"GASTRO-ENT",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"190 , Rte de Tiznit , Imm BICHARA",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Haida Lahcen",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Rte de L' Aéroport",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Id-hammouche Rachid",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"28, 1ère étage - Hay ES-Salam",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Idrissi Abdelaziz",
                   "SPECIALITY":"OPHTAL",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Rte de Tiznit Imm BICHAT",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Ja Mouhamed",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"86, Rte de la Marche Verte",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Jnaini Abdelali",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Imm SADEQ , App 12 Rte de Tiznit ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Jroundi Tarik",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"6, Imm Mabrouka , Av Hassan II , Route de Tiznit ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Khammal Rachid",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Bd EL Massira , Imm BOUMILLA ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Nabih R'kia",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Rue de Marrakech Imm 224",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Rmou Ali",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Imm EL HERCH , Prés de la Mosquée Bouigra",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Sabah Hassan",
                   "SPECIALITY":"ORL ",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Rte de Tiznit , Imm Bicha",
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
                   "FIELD1":18,
                   "ZONE":"",
                   "CITY":"AIT OURIR",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Atajja Mohamed",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Ait Ourir , Quart. Administratif",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"Abidar ",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Chraibi Massira Abdelghani",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Ait Ourir Centre ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"Marrakech",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Debbagh Med Youssef",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Cecle Ait Ourir",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Rahhal Kacemi",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Rte Sidi Rahal ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Wahbi Noureddine",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Ait Ourir , Quart. Administratif , Au dessus de la PH. AIT OURIR",
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
                   "FIELD1":19,
                   "ZONE":"",
                   "CITY":"AKLIM",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Abddaimi Khalid",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"N° 4 Lot Laymoune",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Yacoubi Rajaa",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"301, Village Castor , Bloc 4",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Yahiaoui Loukil",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":" BP 20, Aklim 60250",
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
                   "FIELD1":20,
                   "ZONE":"",
                   "CITY":"AL AOUAMRA",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"El Harrak Abdelouadoud",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av Khalid Ibnou Oualid , Rue Gharnati Bloc B ",
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
                   "FIELD1":21,
                   "ZONE":"",
                   "CITY":"AL HOCIEMA",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Alami Rachid Mohamed",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"139, Bd Abdelkrim El Khattabi",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Aziz Salah",
                   "SPECIALITY":"ORL",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"12, Rue Tétouan",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Barrane Hassan",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"CENTRE DE VILLE TARGUISTE",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Ben Kaddour Mohamed",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"7, Rue Abdellah Hammou",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Bourjila Abdekhalek",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"55 , Bd Abdelkarim El khattabi",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Doukkali Lakkam Samir",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"CENTRE DE VILLE TARGUISTE",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"El Farricha Najib",
                   "SPECIALITY":"ORL",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"10, Bd Abdelkarim El khattabi",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"El Ghaddouri Fatiha",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"44, Rue El Mourabitine",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":" El Hankouri Mekki",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"Clinique BEDES",
                   "ADDRESS":"Cité Casabonita",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"El Idrissi El Alami Mohamed",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"CENTRE DE VILLE TARGUISTE",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"El Wahabi Mohamed",
                   "SPECIALITY":"PEDIATRES",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"48, Bd Abdelkarim",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Errai Mohamed",
                   "SPECIALITY":"OPHTAL",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":" Av Abdelkarim Khattabi Im 10 app 2",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Habaka Said",
                   "SPECIALITY":"OPHTAL",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Bd Med V Passage Soussan Im 8 ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Mohcine Zouhair",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"CENTRE DE VILLE ISSAGGEN",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Ouadghiri Essadik",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"CENTRE DE VILLE ISSAGGEN",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Ouyahya Fouad",
                   "SPECIALITY":"GASTRO-ENT",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"48, Bd Hassan II",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Raji Jamila",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Bd Med V Passage Soussan Im 8 , App N°7",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Salhi Mohamed",
                   "SPECIALITY":"CHIR-URO",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"30 bis , Rue Salah Eddine El Ayoubi ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Taiba Abdesalam",
                   "SPECIALITY":"DERMATO",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"8, Bd Med V , Passage SOUSSANE El Yacoubi",
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
                   "FIELD1":22,
                   "ZONE":"",
                   "CITY":"AMEZMIZ",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Tifnouti Safia",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"32, Av Hassan II Amadel",
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
                   "FIELD1":23,
                   "ZONE":"",
                   "CITY":"ANZA",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Benabdallah Abdelali",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"420 bis Lots Al Wahda , Anza",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Chefchaouni Moussaoui Omar",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":" 372 , Lots Al Whda , Anza",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Lougteb Abdelaziz",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av El Mouhit , Bloc A , N° 4 , (à côté PHAR.Anza)",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Semmar Sanae",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"9 , Bloc D'Anza ",
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
                   "FIELD1":24,
                   "ZONE":"",
                   "CITY":"AOULOUZ",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Beraouz Mohamed",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":" AV HASSAN II ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Lakhnati Abdellatif",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av Hassan II , CENTRE DE VILLE",
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
                   "FIELD1":25,
                   "ZONE":"",
                   "CITY":"AOURIR",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Benbani Redouan",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Douar Asserkit",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Doblali Hasna",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CENTRE DE SANTE TIBARINE",
                   "ADDRESS":"-",
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
                   "FIELD1":26,
                   "ZONE":"",
                   "CITY":"ARBAA AOUNATE",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Nasoh Ilham",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Lots PAM 2ème Tranche",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Rabah Mohamed",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"87 , Cité PAM",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Zrineh Mohamed",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"288 CENTRE PAM",
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
                   "FIELD1":27,
                   "ZONE":"",
                   "CITY":"ARFOUD",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Ismaili Alaoui Abdelaziz",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av Hassan II , Rue Tarfaya",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Khouya Abdelkader",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"100, Bd Med V",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Khoya Mohamed",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"CENTRE VILLE ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":" Lamjimra Fatiha",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"CENTRE VILLE",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Lemjimer Fatiha",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"1 , Rue Al Mokawama , Place des F.A.R ",
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
                   "FIELD1":28,
                   "ZONE":"",
                   "CITY":"ASILAH",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":" Aaddouch Hayat",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"CENTRE VILLE",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Belouaza Abdelatif",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"CENTRE VILLE",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Ben Malek Ahmed",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"2 , Av Hassan II",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"El Gharbi Abdelhay",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"8, Houman El Fttaouaki",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Lysenko Irena",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"2, Rue Prince Hetier",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Sebbari Hassani Abdelaziz",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"28, Lot Gorma , Av Imam Assili",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Sebbaria Aziz",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Complexe Alhir",
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
                   "FIELD1":29,
                   "ZONE":"",
                   "CITY":"ATAOUIA",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Daoudi Samir",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"100, Lot Baddou",
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
                   "FIELD1":30,
                   "ZONE":"",
                   "CITY":"AZEMMOUR",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Benjelloun Fadel",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"13, Rte de la Plage",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Chraibi Salah",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"304, Bd Med V",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"El Azhari Naima",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"45, Bd Zerktouni ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":" El Baz Mohamed",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"40, Av My Bouchaib",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Kafi Abderrahimane",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"80 , Av My El Hassan",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Laaribou Mustapha",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"245 , Bd Mohamed V",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Mouhine Houcine",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":" 14, Rue 2 , Arsat El hentaki",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Najib Hamid",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"54 , Bd My El Hassan",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Tamazi Mustapha",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"15 , Derb Boujida ",
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
                   "FIELD1":31,
                   "ZONE":"",
                   "CITY":"AZILAL",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Derbou Lhoussaine",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av Hassan II ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"El Moussaid Ammar",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av Hassan II ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Ouabbas Omar",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Av Hassan II ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Ouarhad Jamaa",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"2, Bd Hassan II ",
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
                   "FIELD1":32,
                   "ZONE":"",
                   "CITY":"AZROU",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Amzil Abdelkader",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"9, Rue Prince My Abdellah",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Azizi Ibrahim",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"Place Hassan II, 1èr Etage",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Bahri Mohamed",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"59, Rue Tihcen",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Bouchrit Boubker",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CLINIQUE AZROU",
                   "ADDRESS":"Hay Sidi Assou ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Bousfiha Khalid",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"23, Place Hassan II , Rte Midelt",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":" Bouzoubaa Ghizlane",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"163/161 , Bd Hassan II ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Laaboudi Nour-eddine",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":" Place , Hassan II",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Lembarki Mohamed",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":" 2, Rue Sidi yahia Sebbab",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Ahdaf",
                   "DOCTOR NAME":"Ouhsine Mohamed",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"171, Rue de Caire ",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":" Rahhali Latifa",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CLINIQUE AZROU",
                   "ADDRESS":"Hay Sidi Assou",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Rhhali Latifa",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"49, Rue Casablanca",
                   "CONTACT NUMBER":""
               },
               {
                   "FIELD1":null,
                   "ZONE":"",
                   "CITY":"",
                   "MUNICIPALITY":"Ahadaf",
                   "DOCTOR NAME":"Sadik Hamid",
                   "SPECIALITY":"GYNECO-OBSTE",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"-",
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
                   "FIELD1":33,
                   "ZONE":"",
                   "CITY":"AZROU SUD",
                   "MUNICIPALITY":"",
                   "DOCTOR NAME":"Mamad Hassan",
                   "SPECIALITY":"MG",
                   "SECTOR FIELD":"CABINET PRIVE",
                   "ADDRESS":"AZROU SUD",
                   "CONTACT NUMBER":""
               }
           ]
         );*/


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
    }]);
'use strict';

/**
* @ngdoc directive
* @name medviz.directive:client
* @description
* # client
*/
angular.module('medviz')
.directive('client', function ()
{
    return {
        templateUrl: 'scripts/components/client/client-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: ["$scope", "Client", function ($scope, Client)
        {

        }]
    };
});
/**
 * @ngdoc service
 * @name medviz.Client
 * @description
 * # Client
 * Factory in the medviz.
 */
angular.module('medviz')
    .factory('Client', ["Data", "$firebaseObject", "$firebaseArray", function (Data, $firebaseObject, $firebaseArray)
    {
        'use strict';

        // INITIALIZATION
        function newVisit(user, doctor) {
            console.log('visit args', arguments);
            $scope.visits = Data.ref.child('visits');
            $scope.visitsObject = $firebaseObject($scope.visits);
            $scope.visitsArray = $firebaseArray($scope.visits);
            $scope.newVisit = {
                date: Date.now(),
                doctor: doctor,
                user: user,
                drugs: 'druggggggs'
            };
            $scope.visitsArray.$add($scope.newVisit);
            $scope.user = Data.ref.child('users/'+user);
            $scope.userObject = $firebaseObject($scope.user);

        }

        // ACTUAL DEFINITION
        var service = {
            newVisit: newVisit
        };

        return service;
    }]);
'use strict';

/**
* @ngdoc directive
* @name medviz.directive:landing
* @description
* # landing
*/
angular.module('medviz')
.directive('landing', function ()
{
    return {
        templateUrl: 'scripts/components/landing/landing-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: ["$scope", "Landing", function ($scope, Landing)
        {

        }]
    };
});
/**
 * @ngdoc service
 * @name medviz.Landing
 * @description
 * # Landing
 * Service in the medviz.
 */
angular.module('medviz')
    .service('Landing', function ()
    {
        'use strict';

        // AngularJS will instantiate a singleton by calling "new" on this function
    });
'use strict';

/**
* @ngdoc directive
* @name medviz.directive:labs
* @description
* # labs
*/
angular.module('medviz')
.directive('labs', function ()
{
    return {
        templateUrl: 'scripts/components/admin/labs/labs-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: ["$scope", function ($scope)
        {

        }]
    };
});
'use strict';

/**
* @ngdoc directive
* @name medviz.directive:medical
* @description
* # medical
*/
angular.module('medviz')
.directive('medical', function ()
{
    return {
        templateUrl: 'scripts/components/admin/medical/medical-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: ["$scope", function ($scope)
        {

        }]
    };
});
'use strict';

/**
* @ngdoc directive
* @name medviz.directive:visits
* @description
* # visits
*/
angular.module('medviz')
.directive('visits', function ()
{
    return {
        templateUrl: 'scripts/components/admin/visits/visits-d.html',

        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: ["$scope", function ($scope)
        {

        }]
    };
});
'use strict';

/**
* @ngdoc directive
* @name medviz.directive:reps
* @description
* # reps
*/
angular.module('medviz')
.directive('reps', function ()
{
    return {
        templateUrl: 'scripts/components/admin/reps/reps-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: ["$scope", function ($scope)
        {

        }]
    };
});
'use strict';

/**
* @ngdoc directive
* @name medviz.directive:agenda
* @description
* # agenda
*/
angular.module('medviz')
.directive('agenda', function ()
{
    return {
        templateUrl: 'scripts/components/client/agenda/agenda-d.html',

        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: ["$scope", function ($scope)
        {

        }]
    };
});

'use strict';

/**
* @ngdoc directive
* @name medviz.directive:doctors
* @description
* # doctors
*/
angular.module('medviz')
.directive('doctors', function ()
{
    return {
        templateUrl: 'scripts/components/client/doctors/doctors-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: ["$scope", "Data", "$firebaseObject", "$firebaseArray", "Api", function ($scope, Data, $firebaseObject, $firebaseArray, Api)
        {
            $scope.doctors = Data.ref.child('doctors');
            $scope.doctorsObject = $firebaseObject($scope.doctors);
            $scope.doctorsArray = $firebaseArray($scope.doctors);

            $scope.doctorsIndex = Data.ref.child('index/doctors');
            $scope.doctorsIndexObject = $firebaseObject($scope.doctorsIndex);
            $scope.doctorsIndexArray = $firebaseArray($scope.doctorsIndex);

            $scope.newVisit = Api.newVisit;
        }]
    };
});
'use strict';

/**
* @ngdoc directive
* @name medviz.directive:visit
* @description
* # visit
*/
angular.module('medviz')
.directive('visit', function ()
{
    return {
        templateUrl: 'scripts/components/client/visit/visit-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: ["$scope", function ($scope)
        {

        }]
    };
});
'use strict';

/**
* @ngdoc directive
* @name medviz.directive:auth
* @description
* # auth
*/
angular.module('medviz')
.directive('auth', function ()
{
    return {
        templateUrl: 'scripts/components/common/auth/auth-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {
        },
        controller: ["$scope", "$state", "Api", function ($scope, $state, Api)
        {

            $scope.logout = Api.logout;
            $scope.authCheck = Api.authCheck();
            $scope.newUser = Api.newUser;

        }]
    };
});
/**
 * @ngdoc service
 * @name medviz.Auth
 * @description
 * # Auth
 * Factory in the medviz.
 */
angular.module('medviz')
    .factory('Auth', ["Firebase", "$rootScope", "$state", "$stateParams", "Data", function (Firebase, $rootScope, $state, $stateParams, Data)
    {
        'use strict';

        // INITIALIZATION
	    var ref = new Firebase('https://medviz.firebaseio.com');
	    function newUser(name, role, email, password){
	        // TODO set-up index
            ref.createUser({
	              name     : name,
	              role     : role,
                email    : email,
                password : password
            }, function(error, userData) {
                if (error) {
                    console.log('Error creating user:', error);
                } else {
                    console.log("Successfully created user account with uid:", userData.uid);
                    console.log(userData);

                    var addUser = ref.child('users');
	                  var addUserIndex = ref.child('index/users');
		                var newUser = {
			                name: name,
			                role: role,
			                uid: userData.uid,
			                email: email
		                };
                    var theUser = addUser.push(newUser, function(error){
	                    if(error){
		                    console.log('No user data written');
	                    } else {
		                    var id = theUser.key();
		                    console.log('User created');
		                    angular.forEach(newUser, function(prop, key){
			                    if(prop && prop.length>2){
				                    var cleanProp = prop.toLowerCase().replace(/'+/g, '').replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "-").replace(/^-+|-+$/g, '');
				                    addUserIndex.child(key+'/'+cleanProp).push(id);
			                    }
		                    });
/*
		                    addUserIndex.child(userData.uid).push(id);
*/
	                    }
                    });

                }
            });
        }
	    function login(email, pass) {
		    ref.authWithPassword({email:email,password:pass}, function(error, authData){
			    if (error) {
				    console.log(error);
			    } else {
				    console.log('signed in as',authData);
				    console.log(Data.dataObject.index.users[authData.uid].role);
				    $rootScope.role = Data.dataObject.index.users[authData.uid].role;
				    $rootScope.authData = authData;
				    if($rootScope.role === 'rep'){
					    $state.go('medviz.client');
				    } else if ($rootScope.role === 'customer') {
					    $state.go('medviz.admin')
				    } else {
					    $state.reload();
				    }
			    }
		    });
	    }
	    function logout(){ref.unauth();$state.go($state.current, {}, {reload: true});}
	    function authCheck(){return ref.getAuth();}


        // ACTUAL DEFINITION
        var service = {
		        newUser: newUser,
		        login: login,
            logout: logout,
            authCheck: authCheck
        };

        return service;
    }]);
'use strict';

/**
* @ngdoc directive
* @name medviz.directive:fold
* @description
* # fold
*/
angular.module('medviz')
.directive('fold', function ()
{
    return {
        templateUrl: 'scripts/components/landing/fold/fold-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: ["$scope", function ($scope)
        {

        }]
    };
});
'use strict';

/**
* @ngdoc directive
* @name medviz.directive:medvizFooter
* @description
* # medvizFooter
*/
angular.module('medviz')
.directive('medvizFooter', function ()
{
    return {
        templateUrl: 'scripts/components/layout/medviz-footer/medviz-footer-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: ["$scope", function ($scope)
        {

        }]
    };
});
'use strict';

/**
* @ngdoc directive
* @name medviz.directive:medvizNav
* @description
* # medvizNav
*/
angular.module('medviz')
.directive('medvizNav', function ()
{
    return {
        templateUrl: 'scripts/components/layout/medviz-nav/medviz-nav-d.html',
        
        restrict: 'EA',

        link: function (scope, el, attrs)
        {

        },
        controller: ["$scope", function ($scope)
        {

        }]
    };
});
'use strict';

/**
* @ngdoc directive
* @name medviz.directive:medvizHeader
* @description
* # medvizHeader
*/
angular.module('medviz')
.directive('medvizHeader', ["Data", function (Data)
{
    return {
        templateUrl: 'scripts/components/layout/medviz-header/medviz-header-d.html',
        restrict: 'EA',
        link: function (scope, el, attrs)
        {
            scope.data = Data;
        },
        controller: ["$scope", "$state", function ($scope, $state)
        {

        }]
    };
}]);

'use strict';

/**
* @ngdoc directive
* @name medviz.directive:features
* @description
* # features
*/
angular.module('medviz')
.directive('features', function ()
{
    return {
        templateUrl: 'scripts/components/landing/features/features-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: ["$scope", function ($scope)
        {

        }]
    };
});
'use strict';

/**
* @ngdoc directive
* @name medviz.directive:testimonials
* @description
* # testimonials
*/
angular.module('medviz')
.directive('testimonials', function ()
{
    return {
        templateUrl: 'scripts/components/landing/testimonials/testimonials-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: ["$scope", function ($scope)
        {

        }]
    };
});
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
        controller: ["$scope", function ($scope)
        {

        }]
    };
});

'use strict';

/**
* @ngdoc directive
* @name medviz.directive:reg
* @description
* # reg
*/
angular.module('medviz')
.directive('reg', function ()
{
    return {
        templateUrl: 'scripts/components/common/auth/reg/reg-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: ["$scope", "Api", function ($scope, Api)
        {
            $scope.newUser = Api.newUser;
        }]
    };
});
'use strict';

/**
* @ngdoc directive
* @name medviz.directive:signIn
* @description
* # signIn
*/
angular.module('medviz')
.directive('signIn', function ()
{
    return {
        templateUrl: 'scripts/components/common/auth/sign-in/sign-in-d.html',
        
        restrict: 'EA',

        link: function (scope, el, attrs)
        {

        },
        controller: ["$scope", "Api", function ($scope, Api)
        {
            $scope.login = Api.login;
        }]
    };
});