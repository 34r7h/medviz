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
    'ui.router'
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
    .config(["$stateProvider", function ($stateProvider)
    {
        'use strict';

        $stateProvider
            .state('medviz', {
                url:'',
                template:'<medviz-header></medviz-header><ui-view></ui-view><medviz-footer/>'
            })
            .state('medviz.client', {
                url:'/client',
                template:'<ui-view></ui-view>'
            })
            .state('medviz.client.login', {
                url:'/login',
                template:'<auth></auth>'
            })
            .state('medviz.client.agenda', {
                url:'/agenda',
                template:'<agenda></agenda>'
            })
            .state('medviz.client.doctor', {
                url:'/doctor-info',
                template:'<profile></profile><map></map>'
            })
            .state('medviz.client.visit', {
                url:'/visit',
                template:'<profile></profile><medviz-form></medviz-form>'
            })
            .state('medviz.client.submit', {
                url:'/submit',
                template:'<medviz-table>'
            })
            .state('medviz.admin', {
                url:'/admin',
                template:'<ui-view></ui-view>'
            })
            .state('medviz.admin.login', {
                url:'/login',
                template:'<auth></auth>'
            })
            .state('medviz.admin.dashboard', {
                url:'/dashboard',
                template:'<profile></profile><medviz-sections></medviz-sections><medviz-form></medviz-form><medviz-table></medviz-table><admin-ui></admin-ui>'
            })
            .state('medviz.landing', {
                url:'/landing',
                template:'<fold></fold><features></features><testimonials></testimonials>'
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
    .factory('Api', function ()
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
/**
 * @ngdoc service
 * @name medviz.Data
 * @description
 * # Data
 * Factory in the medviz.
 */
angular.module('medviz')
    .factory('Data', function ()
    {
        'use strict';

        // INITIALIZATION


        // ACTUAL DEFINITION
        var service = {
            test: 'test this factory',
            users:['alex','pat']

        };

        return service;
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
* @name medviz.directive:map
* @description
* # map
*/
angular.module('medviz')
.directive('map', function ()
{
    return {
        templateUrl: 'scripts/components/client/map/map-d.html',
        
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
        scope: {},
        link: function (scope, el, attrs)
        {
            scope.data = Data;
        },
        controller: ["$scope", function ($scope)
        {
            $scope.ctrlData = Data.test;
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