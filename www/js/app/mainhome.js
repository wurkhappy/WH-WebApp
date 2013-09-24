/*
 * Initialize App for `Account Page`.
 *
 */
 require.config({

 	paths: {
 		marionette: 'lib/backbone.marionette/lib/backbone.marionette',
 	},

 	shim: {
 		marionette : {
 			deps : ['jquery', 'underscore', 'backbone'],
 			exports : 'Marionette'
 		}
 	}
 });
 define(function (require) {



 	'use strict';

 	var HomeRouter = require('../app/routers/home_router');

 	$(function () {

    // Initialize the application router.
    var Router = new HomeRouter();

    Backbone.history.start({
    	pushState: false
    });

});

 });