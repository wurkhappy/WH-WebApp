/*
 * Initialize App for `Landing Page`.
 *
 */

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