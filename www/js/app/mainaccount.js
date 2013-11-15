/*
 * Initialize App for `Account Page`.
 *
 * A require.config here will be ignored in r.js optimizer
 *
 */

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