/*
 * Initialize App for `Landing Page`.
 *
 */


 require.config({

 	paths: {
 		parsley: 'lib/parsleyjs/dis/parsley.min.js',
 	},

 	shim: {
 		parsley : {
 			deps : ['jquery']
 		}
 	}
 });

define(function (require) {

  'use strict';

  var LandingRouter = require('../app/routers/landing_router');

  $(function () {

    // Initialize the application router.
    var Landing = new LandingRouter();

    Backbone.history.start({
      pushState: false
    });

  });

});