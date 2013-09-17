/*
 * Initialize App for `Account Page`.
 *
 */

define(function (require) {

  'use strict';

  var AccountRouter = require('../app/routers/account_router');

  $(function () {

    // Initialize the application router.
    var Account = new AccountRouter();

    Backbone.history.start({
      pushState: false
    });

  });

});