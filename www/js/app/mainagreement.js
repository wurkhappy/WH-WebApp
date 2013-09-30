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

  var AgreementRouter = require('../app/routers/agreement_router');

  $(function () {

    // Initialize the application router.
    var Router = new AgreementRouter();

    Backbone.history.start({
      pushState: false
    });

  });

});