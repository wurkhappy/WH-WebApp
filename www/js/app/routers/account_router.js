/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

define([
  'backbone',
  'views/account/main_container_view',
  'views/account/personal_view',
  'views/account/credit_card_view',
  'views/account/bank_account_view',
  'views/account/password_view'],
  function (Backbone, MainContainer, PersonalView, CreditCardView, BankAccountView, PasswordView) {

      'use strict';

      var AccountRouter = Backbone.Router.extend({

        routes: {
          'personal': 'personal',
          'password': 'password',
          'creditcard': 'creditCard',
          'bankaccount': 'bankAccount'
        },

        initialize: function () {
          // model stuff here. Let's get this working after setting up basic views
          //this.model = new AgreementModel();
          //this.model.set("payments", [{title:"Wireframe", amount:10.5}]);

          // Initialize main View.
          this.mainContainer = new MainContainer({router:this});

        },

        personal: function () {
          if (!this.personalView) {
            // need to add in model stuff
            this.personalView = new PersonalView();
          }
          this.mainContainer.switchToView(this.personalView);
        },

        password: function () {
          if (!this.passwordView) {
            // need to add in model stuff
            this.passwordView = new PasswordView();
          }
          this.mainContainer.switchToView(this.passwordView);
        },

        creditCard: function () {
          if (!this.creditCardView) {
            // need to add in model stuff
            this.creditCardView = new CreditCardView();
          }
          this.mainContainer.switchToView(this.creditCardView);
        },

        bankAccount: function () {
          if (!this.bankAccountView) {
            // need to add in model stuff
            this.bankAccountView = new BankAccountView();
          }
          this.mainContainer.switchToView(this.bankAccountView);
        }

      });

      return AccountRouter;

    }
);