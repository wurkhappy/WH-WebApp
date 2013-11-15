/*
 * Initialize App for Landing Page.
 *
 * A require.config here will be ignored in r.js optimizer
 *
 */

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
