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
	.config(["$stateProvider", function ($stateProvider) {
		'use strict';

		$stateProvider
			.state('medviz', {
				url: '',
				template: '<medviz-header></medviz-header>' +
				'<div ui-view="{{view.view}}" class="grid-container"></div>' +
				'<medviz-footer></medviz-footer>',
				controller: ["$scope", "$state", "Data", "Api", function($scope, $state, Data, Api){
					$scope.view = {};
					$scope.ctrlData = Data.test;
					$scope.view.section='';
					$scope.view.view=$state.params.view;


				}]
			})
			.state('medviz.client', {
				url: '/client/:view',
				views: {
					'':{
						template:'<auth></auth>'
					},
					'doctors':{
						template:'<agenda></agenda>'
					},
					'form': {
						template:'<medviz-form></medviz-form>'
					}
				}
			})
			/*.state('medviz.auth.login', {
				url: '/auth',
				template: '<auth></auth>'
			})
			.state('medviz.client.agenda', {
				url: '/agenda',
				template: '<agenda></agenda>'
			})
			.state('medviz.client.visit', {
				url: '/visit',
				template: '<profile></profile><medviz-form></medviz-form>'
			})
			.state('medviz.client.submit', {
				url: '/submit',
				template: '<medviz-table>'
			})*/
			.state('medviz.admin', {
				url: '/admin/:view',
				//template: '<ui-view></ui-view>'
				views:{
					'':{
						template:'<auth></auth>'
					},
					login:{
						template:'<auth></auth>'
					},
					dashboard:{
						template: '<medviz-sections></medviz-sections>'
					}
				}
			})
			/*.state('medviz.admin.dashboard', {
				url: '/dashboard',
				template: '<profile></profile><medviz-sections></medviz-sections><medviz-form></medviz-form><medviz-table></medviz-table><admin-ui></admin-ui>'
			})*/
			.state('medviz.landing', {
				url: '/landing/:view',
				//template: '<fold></fold><features></features><testimonials></testimonials>',
				views:{
					'':{
						template:'<fold></fold><features></features><testimonials></testimonials>'
					},
					fold:{
						template:'<fold></fold>'
					},
					features:{
						template:'<features></features>'
					},
					testimonials:{
						template:'<testimonials></testimonials>'
					}
				}
			})
			/* STATES-NEEDLE - DO NOT REMOVE THIS */;

	}]);

/**
 * @ngdoc service
 * @name medviz.Api
 * @description
 * # Api
 * Factory in the medviz.
 */
angular.module('medviz')
    .factory('Api', ["$rootScope", "$state", "Data", "Firebase", function ($rootScope, $state, Data, Firebase)
    {
        'use strict';

        // INITIALIZATION
        var ref = new Firebase('https://medviz.firebaseio.com');
        var data = Data;

    // Function Definitions
        function login(email, pass) {ref.authWithPassword({email:email,password:pass}, function(error, authData){if (error) {console.log(error);} else {$rootScope.authData = authData;}});}
        function logout(){ref.unauth();$state.go($state.current, {}, {reload: true});}
        function authCheck(){return ref.getAuth();}
        //function reloadState() {$state.go($state.current, {}, {reload: true});}

        // ACTUAL DEFINITION
        var service = {
            login: login,
            logout: logout,
            authCheck: authCheck
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
        var dataObject=$firebaseObject(ref);
        var dataArray=$firebaseArray(ref);


        // ACTUAL DEFINITION
        var service = {
            dataObject: dataObject,
            dataArray: dataArray
        };

        return service;
    }]);

'use strict';

/**
* @ngdoc directive
* @name medviz.directive:auth
* @description
* # auth
*/
angular.module('medviz')
.directive('auth', ["Api", "Data", function (Api, Data)
{
    return {
        templateUrl: 'scripts/components/common/auth/auth-d.html',
        
        restrict: 'EA',
        scope: {

        },
        link: function (scope, el, attrs)
        {
        },
        controller: ["$scope", "$state", function ($scope, $state)
        {

            $scope.login = Api.login;
            $scope.logout = Api.logout;
            $scope.authCheck = Api.authCheck();

            $scope.dataArray = Data.dataArray;
            $scope.dataObject = Data.dataObject;


        }]
    };
}]);
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
        templateUrl: 'scripts/components/common/profile/profile-d.html',

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
* @name medviz.directive:medvizForm
* @description
* # medvizForm
*/
angular.module('medviz')
.directive('medvizForm', function ()
{
    return {
        templateUrl: 'scripts/components/display/medviz-form/medviz-form-d.html',
        
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
* @name medviz.directive:medvizTable
* @description
* # medvizTable
*/
angular.module('medviz')
.directive('medvizTable', function ()
{
    return {
        templateUrl: 'scripts/components/display/medviz-table/medviz-table-d.html',
        
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
* @name medviz.directive:adminUi
* @description
* # adminUi
*/
angular.module('medviz')
.directive('adminUi', function ()
{
    return {
        templateUrl: 'scripts/components/admin/admin-ui/admin-ui-d.html',
        
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
* @name medviz.directive:medvizSections
* @description
* # medvizSections
*/
angular.module('medviz')
.directive('medvizSections', function ()
{
    return {
        templateUrl: 'scripts/components/admin/medviz-sections/medviz-sections-d.html',
        
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
        templateUrl: 'scripts/components/display/medviz-nav/medviz-nav-d.html',
        
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
* @name medviz.directive:features
* @description
* # features
*/
angular.module('medviz')
.directive('features', function ()
{
    return {
        templateUrl: 'scripts/components/spa/features/features-d.html',
        
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
        templateUrl: 'scripts/components/spa/fold/fold-d.html',
        
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
        templateUrl: 'scripts/components/spa/testimonials/testimonials-d.html',
        
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