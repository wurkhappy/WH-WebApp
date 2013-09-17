/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

define(['backbone', 'views/signup/signupview', 'views/signup/personal_signupview', 'views/signup/payment_signupview'],

    function (Backbone, SignupView, PersonalView, PaymentView) {

      'use strict';

      var SignupRouter = Backbone.Router.extend({

        routes: {
          '': 'index',
          'personal': 'showPersonal',
          'payment': 'showPayment'
        },

        initialize: function () {

          // Setup the root-level application View.
          this.mainView = new SignupView();


          // Initialize other Views.
          this.paymentView = new PaymentView();
          this.personalView = new PersonalView();

        },

        index: function () {

          // Render the about view.
          this.personalView.render().el;

        },

        showPersonal: function () {

          //var personalView = new PersonalView();

          // render about view
          this.personalView.render().el;

        },

        showPayment: function () {

          //var paymentView = new PaymentView();

          // render the pricing view
         this.paymentView.render().el;
        }

      });

      return SignupRouter;

    }
);