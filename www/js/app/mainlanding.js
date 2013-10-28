/*
 * Initialize App for `Landing Page`.
 *
 */


 require.config({

 	paths: {
 		parsley: 'lib/parsleyjs/dist/parsley.min'
 	},

 	shim: {
 		parsley : {
 			deps : ['jquery'],
 			exports : 'parsley'
 		}
 	}
 });

define(function (require) {

  'use strict';

  var LandingRouter = require('app/routers/landing_router');

  $(function () {

    // Initialize the application router.
    var Landing = new LandingRouter();

    Backbone.history.start({
      pushState: false
    });

  });

});
