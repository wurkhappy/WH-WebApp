/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

define(['backbone', 'views/account/accountview', 'views/account/personal_accountview', 'views/account/credit_card_accountview', 'views/account/bank_account_accountview', 'views/account/password_accountview'],

    function (Backbone, AccountView, PersonalView, CreditCardView, BankAccountView, PasswordView) {

      'use strict';

      var AccountRouter = Backbone.Router.extend({

        routes: {
          '': 'index',
          'personal': 'showPersonal',
          'password': 'showPassword',
          'creditcard': 'showCreditCard',
          'bankaccount': 'showBankAccount'
        },

        initialize: function () {

          // Setup the root-level application View.
          this.mainView = new AccountView();


          // Initialize other Views.
          this.bankAccountView = new BankAccountView();
          this.personalView = new PersonalView();
          this.creditCardView = new CreditCardView();
          this.passwordView = new PasswordView();

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

        showPassword: function () {

          //var paymentView = new PaymentView();

          // render the pricing view
          this.passwordView.render().el;
        },

        showCreditCard: function () {

          //var personalView = new PersonalView();

          // render about view
          this.creditCardViewView.render().el;

        },

        showBankAccount: function () {

          //var paymentView = new PaymentView();

          // render the pricing view
          this.bankAccount.render().el;
        }

      });

      return AccountRouter;

    }
);