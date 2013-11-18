/*
 * Initialize App for Agreement Page.
 *
 * A require.config here would be ignored in r.js optimizer
 *
 */

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