/*
 * Initialize App for Sample Home Page.
 *
 */
 define(function (require) {



 	'use strict';

 	var HomeRouter = require('app/routers/sample_home_router');

 	$(function () {

    // Initialize the application router.
    var Router = new HomeRouter();

    Backbone.history.start({
    	pushState: false
    });

});

 });