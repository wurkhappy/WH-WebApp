/*
 * Initialize App for `Account Page`.
 *
 * A require.config here will be ignored in r.js optimizer
 *
 */

 define(function (require) {

 	'use strict';
 	var AccountRouter = require('app/routers/account_router');
 	$(function () {
	    // Initialize the application router.
	    var Account = new AccountRouter();

	    Backbone.history.start({
	    	pushState: false
    });

});

 });