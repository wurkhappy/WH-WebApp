/*
 * Initialize App for Agreement Page.
 *
 * A require.config here would be ignored in r.js optimizer
 *
 */

 define(function (require) {

 	'use strict';

 	var ArchivesRouter = require('app/routers/archives_router');

 	$(function () {

    // Initialize the application router.
    var Router = new ArchivesRouter();

    Backbone.history.start({
    	pushState: false
    });

});

 });