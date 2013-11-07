/*
 * Initialize App for `Create Agreement Page`.
 *
 */
 require.config({

 	paths: {
 		marionette: 'lib/backbone.marionette/lib/backbone.marionette',
 		parsley: 'lib/parsleyjs/dist/parsley.min'
 	},

 	shim: {
 		marionette : {
 			deps : ['jquery', 'underscore', 'backbone'],
 			exports : 'Marionette'
 		},
 		parsley : {
 			deps : ['jquery'],
 			exports : 'parsley'
 		}
 	}
 });
 define(function (require) {

 	'use strict';
 	balanced.init('/v1/marketplaces/TEST-MP1f775iSL82BucxjmR83cOk');
 	var AccountRouter = require('app/routers/account_router');
 	$(function () {
	    // Initialize the application router.
	    var Account = new AccountRouter();

	    Backbone.history.start({
	    	pushState: false
    });

});

 });