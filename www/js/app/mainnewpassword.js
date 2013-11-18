/*
 * Initialize App for Create Agreement Page.
 *
 * A require.config here will be ignored in r.js optimizer
 *
 */

define(function (require) {

  'use strict';

  var LandingRouter = require('app/routers/new_password_router');

  $(function () {

    // Initialize the application router.
    var Landing = new LandingRouter();

    Backbone.history.start({
      pushState: false
    });

  });

});
