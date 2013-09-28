/*
 * Initialize App for `Signup Page`.
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

  var SignupRouter = require('../app/routers/signup_router');

  $(function () {
    // Initialize the application router.
    var Signup = new SignupRouter();

    Backbone.history.start({
      pushState: false
    });

  });

});