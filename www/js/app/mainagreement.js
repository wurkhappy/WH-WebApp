/*
 * Initialize App for `Account Page`.
 *
 */
 require.config({

 	paths: {
 		marionette: 'lib/backbone.marionette/lib/backbone.marionette',
 		noty: 'lib/noty/js/noty/jquery.noty',
 		"noty-inline": 'lib/noty/js/noty/layouts/inline',
 		"noty-default": 'lib/noty/js/noty/themes/default',
 		"intro": 'lib/intro.js/intro',
 	},

 	shim: {
 		marionette : {
 			deps : ['jquery', 'underscore', 'backbone'],
 			exports : 'Marionette'
 		},
 		noty : {
 			deps : ['jquery'],
 			exports : 'noty'
 		},
 		"noty-inline" : {
 			deps : ['noty']
 		},
 		"noty-default" : {
 			deps : ['noty']
 		},
 		"intro" : {
 			exports : ['introJs']
 		}
 	}
 });
 define(function (require) {

 	'use strict';

 	var AgreementRouter = require('app/routers/agreement_router');

 	$(function () {

    // Initialize the application router.
    var Router = new AgreementRouter();

    Backbone.history.start({
    	pushState: false
    });

});

 });