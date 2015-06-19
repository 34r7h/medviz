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
				controller: ["$scope", "$state", "Data", "Api", "$rootScope", function($scope, $state, Data, Api, $rootScope){
					$scope.view = {};
					$scope.ctrlData = Data.test;
					$scope.view.section='';
					$scope.view.view=$state.params.view;
					Api.authCheck();
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
            refreshAddNewModel: Admin.refreshAddNewModel,
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
    }]);

'use strict';

/**
* @ngdoc directive
* @name medviz.directive:admin
* @description
* # admin
*/
angular.module('medviz')
.directive('admin', ["Api", function (Api)
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
            $scope.Api = Api;
        }]
    };
}]);
/**
 * @ngdoc service
 * @name medviz.Admin
 * @description
 * # Admin
 * Factory in the medviz.
 */
angular.module('medviz')
    .factory('Admin', ["Firebase", "Data", "$firebaseObject", "$firebaseArray", "$window", "$rootScope", "$timeout", function (Firebase, Data, $firebaseObject, $firebaseArray, $window, $rootScope, $timeout)
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
            console.log('geolocation',cLoc);
            console.log('geolocation2',geolocation);
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
        function newVisit(user, doctor, drugs, notes) {
            console.log('visit args', arguments);
            $scope.visits = Data.ref.child('visits');
            $scope.visitsObject = $firebaseObject($scope.visits);
            $scope.visitsArray = $firebaseArray($scope.visits);
            $scope.newVisit = {
                date: Date.now(),
                doctor: doctor,
                user: user,
                drugs: drugs,
                notes: notes
            };
            $scope.visitsArray.$add($scope.newVisit).then(function() {
                alert('Profile saved!');
            }).catch(function(error) {
                alert('Error!');
            });
            $scope.user = Data.ref.child('index/users/uid/'+user);
	        $scope.userObject = $firebaseObject($scope.user);
	        console.log('user as pertaining to a visit', $scope.userObject);


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
* @name medviz.directive:addNew
* @description
* # addNew
*/
angular.module('medviz')
.directive('addNew', ["Api", "Data", function (Api, Data)
{
    return {
        templateUrl: 'scripts/components/admin/add-new/add-new-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: ["$scope", function ($scope)
        {
            $scope.newModels = Data.newModels;
            $scope.createEntry = Api.create;
            $scope.addNewModels = {};
            Api.refreshAddNewModel($scope.newModels, $scope.addNewModels);
            $scope.refreshAddNewModel = Api.refreshAddNewModel;
        }]
    };
}]);
'use strict';

/**
* @ngdoc directive
* @name medviz.directive:doctor
* @description
* # doctor
*/
angular.module('medviz')
.directive('doctors', ["Api", "Data", "$firebaseObject", "$firebaseArray", function (Api, Data, $firebaseObject, $firebaseArray)
{
    return {
        templateUrl: 'scripts/components/admin/doctors/doctors-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: ["$scope", function ($scope)
        {
            $scope.doctors = Data.ref.child('doctors').limitToFirst(100);
            $scope.doctorsObject = $firebaseObject($scope.doctors);
            $scope.doctorsArray = $firebaseArray($scope.doctors);

            $scope.doctorsIndex = Data.ref.child('index/doctors').limitToFirst(10);
            $scope.doctorsIndexObject = $firebaseObject($scope.doctorsIndex);
            $scope.doctorsIndexArray = $firebaseArray($scope.doctorsIndex);
        }]
    };
}]);
'use strict';

/**
* @ngdoc directive
* @name medviz.directive:drugs
* @description
* # drugs
*/
angular.module('medviz')
.directive('drugs', ["Api", "Data", "$firebaseObject", "$firebaseArray", function (Api, Data, $firebaseObject, $firebaseArray)
{
    return {
        templateUrl: 'scripts/components/admin/drugs/drugs-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: ["$scope", function ($scope)
        {
            $scope.drugs = Data.ref.child('drugs');
            $scope.drugsObject = $firebaseObject($scope.drugs);
            $scope.drugsArray = $firebaseArray($scope.drugs);
    
            $scope.drugsIndex = Data.ref.child('index/drugs');
            $scope.drugsIndexObject = $firebaseObject($scope.drugsIndex);
            $scope.drugsIndexArray = $firebaseArray($scope.drugsIndex);

            $scope.update = Api.update;
        }]
    };
}]);
'use strict';

/**
* @ngdoc directive
* @name medviz.directive:users
* @description
* # users
*/
angular.module('medviz')
.directive('users', ["Api", "Data", "$firebaseObject", "$firebaseArray", function (Api, Data, $firebaseObject, $firebaseArray)
{
    return {
        templateUrl: 'scripts/components/admin/users/users-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: ["$scope", function ($scope)
        {
            $scope.users = Data.ref.child('users');
            $scope.usersObject = $firebaseObject($scope.users);
            $scope.usersArray = $firebaseArray($scope.users);

            $scope.usersIndex = Data.ref.child('index/users');
            $scope.usersIndexObject = $firebaseObject($scope.usersIndex);
            $scope.usersIndexArray = $firebaseArray($scope.usersIndex);

            $scope.update = Api.update;
        }]
    };
}]);
'use strict';

/**
* @ngdoc directive
* @name medviz.directive:visits
* @description
* # visits
*/
angular.module('medviz')
.directive('visits', ["Data", "$firebaseObject", "$firebaseArray", function (Data, $firebaseObject, $firebaseArray)
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
            $scope.visits = Data.ref.child('visits');
            $scope.visitsObject = $firebaseObject($scope.visits);
            $scope.visitsArray = $firebaseArray($scope.visits);
            console.log('visits dataObject',Data.dataObject);
            $scope.userRef = function(id){
                return Data.dataObject.users[id].name;
            };
            $scope.doctorRef = function(id){
                return Data.dataObject.doctors[id]['doctor name'];
            };
    
            $scope.visitsIndex = Data.ref.child('index/visits');
            $scope.visitsIndexObject = $firebaseObject($scope.visitsIndex);
            $scope.visitsIndexArray = $firebaseArray($scope.visitsIndex);
        }]
    };
}]);
'use strict';

/**
* @ngdoc directive
* @name medviz.directive:doctors
* @description
* # doctors
*/
angular.module('medviz')
.directive('doctor', function ()
{
    return {
        templateUrl: 'scripts/components/client/doctor/doctor-d.html',
        
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
.directive('visit', ["Api", "Data", "$window", function (Api, Data, $window)
{
    return {
        templateUrl: 'scripts/components/client/visit/visit-d.html',
        
        restrict: 'EA',

        link: function (scope, el, attrs)
        {

        },
        controller: ["$scope", function ($scope)
        {
            $scope.newVisit = Api.create;
            $scope.authCheck = Api.authCheck;
            $scope.newModels = Data.newModels;


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
* @name medviz.directive:agenda
* @description
* # agenda
*/
angular.module('medviz')
.directive('agenda', function ()
{
    return {
        templateUrl: 'scripts/components/common/agenda/agenda-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {

        },
        controller: ["$scope", "Agenda", function ($scope, Agenda)
        {

        }]
    };
});
/**
 * @ngdoc service
 * @name medviz.Agenda
 * @description
 * # Agenda
 * Service in the medviz.
 */
angular.module('medviz')
    .service('Agenda', function ()
    {
        'use strict';

        // AngularJS will instantiate a singleton by calling "new" on this function
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
    .factory('Auth', ["Firebase", "$rootScope", "$state", "$stateParams", "Data", "$firebaseArray", "$firebaseObject", "$firebaseAuth", function (Firebase, $rootScope, $state, $stateParams, Data, $firebaseArray, $firebaseObject, $firebaseAuth)
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
	                  login(email, password);

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
				    console.log('signed in as',authData.uid);
				    var uid = authData.uid.toLowerCase().replace(/'+/g, '').replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "-").replace(/^-+|-+$/g, '');
				    angular.forEach(Data.dataObject.index.users.uid[uid],function(id, key){
					    $rootScope.role = Data.dataObject.users[id].role;
					    $rootScope.auth = {authData:authData, id:id, role:Data.dataObject.users[id].role};
				    });
				    if($rootScope.role === 'rep'){
					    $state.go('medviz.client');
				    } else if ($rootScope.role === 'admin') {
					    $state.go('medviz.admin')
				    } else {
					    $state.reload();
				    }
			    }
		    });
	    }
	    function logout(){ref.unauth(); $rootScope.role = null; $state.go($state.current, {}, {reload: true});}


	    function authCheck(){
		    console.log('/////////////  Checking Auth');
		    var getAuth = $firebaseAuth(Data.ref);
		    if(getAuth.$getAuth() !== null){
			    console.log('signed in as', getAuth.$getAuth().auth.uid);
			    var auth = getAuth.$getAuth();
			    console.log('auth',auth);
			    var uid = auth.uid.toLowerCase().replace(/'+/g, '').replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "-").replace(/^-+|-+$/g, '');

			    var userIndexRef = Data.ref.child('index/users/uid/'+uid);
			    var userIndexArray = $firebaseArray(userIndexRef);
			    var userIndexObject = $firebaseObject(userIndexRef);
			    userIndexArray.$loaded(
				    function(data) {
					    var id = userIndexArray[0].$value;
					    console.log(id,'id');
					    var userRef = Data.ref.child('users/'+id);
					    console.log('userRef',userRef);
					    var userObject = $firebaseObject(userRef);
					    userObject.$loaded(function(data){
						    console.log('userObject',data.role);
						    $rootScope.name = data.name;
						    $rootScope.email = data.email;
						    $rootScope.role = data.role;
						    $rootScope.id = id;

					    });
				    },
				    function(error) {
					    console.error("Error:", error);
				    }
			    );

		    }
		    console.log('/////////////  Done Checking Auth');

	    }


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
        controller: ["$scope", "Data", "$rootScope", "$timeout", function ($scope, Data, $rootScope, $timeout)
        {
            $timeout(function(){
                $scope.user = Data.dataObject.users[$rootScope.id];
              }, 3000
            );
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