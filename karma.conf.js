// Karma configuration
'use strict';

module.exports = function (config)
{
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            // bower:js
            'app/bower_components/es5-shim/es5-shim.js',
            'app/bower_components/json3/lib/json3.js',
            'app/bower_components/angular/angular.js',
            'app/bower_components/angular-animate/angular-animate.js',
            'app/bower_components/angular-aria/angular-aria.js',
            'app/bower_components/angular-resource/angular-resource.js',
            'app/bower_components/angular-ui-router/release/angular-ui-router.js',
            'app/bower_components/angular-mocks/angular-mocks.js',
            // endbower

            // modules first
            'app/scripts/**/_*.js',
            // all the rest of the files
            'app/scripts/**/*.js',
            // load html as well as required for karma-ng-html2js-preprocessor
            'app/scripts/**/*.html'
        ],


        // list of files to exclude
        exclude: [],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        plugins: [
            'karma-jasmine',
            //'karma-coverage',
            'karma-phantomjs-launcher',
            'karma-ng-html2js-preprocessor'
        ],

        preprocessors: {
            //'**/app/scripts/*/*.js': 'coverage',
            '**/app/scripts/**/*.html': 'ng-html2js'
        },

        ngHtml2JsPreprocessor: {
            moduleName: 'templates',
            stripPrefix: 'app/'
        },

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};
