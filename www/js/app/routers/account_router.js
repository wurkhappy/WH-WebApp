/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

define([
  'backbone',
  'views/account/main_container_view',
  'views/account/personal_view',
  'views/account/credit_card_layout',
  'views/account/bank_account_view',
  'views/account/password_view',
  'models/user'],
  function (Backbone, MainContainer, PersonalView, CreditCardView, BankAccountView, PasswordView, UserModel) {

      'use strict';

      var AccountRouter = Backbone.Router.extend({

        routes: {
          '': 'personal',
          'personal': 'personal',
          'password': 'password',
          'creditcard': 'creditCard',
          'bankaccount': 'bankAccount'
        },

        initialize: function () {
          this.mainContainer = new MainContainer({router:this});
          this.model = new UserModel(window.thisUser);
        },

        personal: function () {
          if (!this.personalView) {
            this.personalView = new PersonalView({model: this.model});
          }
          this.mainContainer.switchToView(this.personalView);
        },

        password: function () {
          if (!this.passwordView) {
            this.passwordView = new PasswordView({model: this.model});
          }
          this.mainContainer.switchToView(this.passwordView);
        },

        creditCard: function () {
          if (!this.creditCardView) {
            this.creditCardView = new CreditCardView({model: this.model});
          }
          this.mainContainer.switchToView(this.creditCardView);
        },

        bankAccount: function () {
          if (!this.bankAccountView) {
            this.bankAccountView = new BankAccountView();
          }
          this.mainContainer.switchToView(this.bankAccountView);
        }

      });

      return AccountRouter;

    }
);