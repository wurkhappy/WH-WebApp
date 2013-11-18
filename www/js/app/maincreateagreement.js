/*
 * Initialize App for Create Agreement Page.
 *
 * A require.config here will be ignored in r.js optimizer
 *
 */

 define(function (require) {

 	'use strict';

 	var CreateAgreementRouter = require('app/routers/create_agreement_router');

 	$(function () {

    // Initialize the application router.
    var CreateAgreement = new CreateAgreementRouter();

    Backbone.history.start({
    	pushState: false
    });

});

 });