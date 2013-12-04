/*
 * Initialize App for Legal Page.
 *
 * A require.config here will be ignored in r.js optimizer
 *
 */

define(function (require) {

  'use strict';

  var LegalRouter = require('app/routers/legal_router');

  $(function () {

    // Initialize the application router.
    var Legal = new LegalRouter();

    Backbone.history.start({
      pushState: false
    });

  });

});
