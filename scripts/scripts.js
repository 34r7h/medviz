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
            remove: Admin.remove

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
    .factory('Client', function ()
    {
        'use strict';

        // INITIALIZATION


        // ACTUAL DEFINITION
        var service = {
            someMethod: function ()
            {

            }
        };

        return service;
    });
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
                    var theUser = addUser.push({
	                      name: name,
	                      role: role,
                        uid: userData.uid,
                        email: email
                    }, function(error){
	                    if(error){
		                    console.log('No user data written');
	                    } else {
		                    var id = theUser.key();
		                    console.log('User created');
		                    addUserIndex.child(userData.uid).set({
			                    name: name,
			                    role: role,
			                    id: id,
			                    email: email
		                    });
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
        controller: ["$scope", function ($scope)
        {

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