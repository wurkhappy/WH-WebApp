/*
 * Initialize App for `Signup Page`.
 *
 */

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