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

 	var CreateAgreementRouter = require('../app/routers/create_agreement_router');

 	$(function () {

    // Initialize the application router.
    var CreateAgreement = new CreateAgreementRouter();

    Backbone.history.start({
    	pushState: false
    });

});

 });