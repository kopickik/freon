/*globals require*/
require.config({
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery',
        'velocity': '../bower_components/velocity/velocity',
        'velocity-ui': '../bower_components/velocity/velocity.ui',
        'blast': '../bower_components/blast-text/jquery.blast',
        //'lodash': '../bower_components/lodash/dist/lodash',
        'underscore': '../bower_components/underscore/underscore',
        //'backbone': '../bower_components/backbone/backbone',
        'angular': '../bower_components/angular/angular',
        'angularRoute': '../bower_components/angular-route/angular-route',
        'angularMocks': '../bower_components/angular-mocks/angular-mocks',
        'text': '../bower_components/text/text'
    },
    shim: {
        'velocity': {
            'deps': ['jquery']
        },
        'velocity-ui': {
            'deps': ['velocity']
        },
        'blast': {
            'deps': ['jquery']
        },
        'angular' : {
            'exports' : 'angular'
        },
        'angularRoute': ['angular'],
        'angularMocks': {
            deps: ['angular'],
            exports: 'angular.mock'
        },
        'underscore': {
            'exports': '_'
        },
        'jquery': {
            'exports': '$'
        }
    },
    packages: [

    ],
    priority: [
    'angular'
    ]
});
require([
    'jquery',
    'velocity',
    'velocity-ui',
    'blast',
    'underscore',
    'angular',
    'angularRoute',
    'text',
    'main'], function($, Velocity, _, angular, main){});
