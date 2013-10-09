/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

define(['backbone', 'views/landing/landingview'],

    function (Backbone, LandingView) {

      'use strict';

      var LandingRouter = Backbone.Router.extend({

        routes: {
          '': 'index',
        },

        initialize: function () {

          // Setup the root-level application View.
          this.mainView = new LandingView();
        },

        index: function () {
          if (!this.landingView) this.landingView = new LandingView({router:this, model: this.model});
        },

      });

      return LandingRouter;

    }
);