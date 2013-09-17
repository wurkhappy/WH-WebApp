/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

define(['backbone', 'views/landing/landingview', 'views/landing/aboutview', 'views/landing/pricingview'],

    function (Backbone, LandingView, AboutView, PricingView) {

      'use strict';

      var LandingRouter = Backbone.Router.extend({

        routes: {
          '': 'index',
          'about': 'showAbout',
          'pricing': 'showPricing'
        },

        initialize: function () {

          // Setup the root-level application View.
          this.mainView = new LandingView();


          // Initialize other Views.
          this.aboutView = new AboutView();

        },

        index: function () {

          // Render the about view.
          this.aboutView.render().el;

        },

        showAbout: function () {

          var aboutView = new AboutView();

          // render about view
          aboutView.render().el;

        },

        showPricing: function () {

          var pricingView = new PricingView();

          // render the pricing view
          pricingView.render().el;
        }

      });

      return LandingRouter;

    }
);