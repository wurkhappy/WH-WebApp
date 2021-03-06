/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

 define([
  'backbone',
  'parsley',
  'flying-focus',
  'views/account/main_container_view',
  'views/account/personal_view',
  'views/account/credit_card_layout',
  'views/account/bank_account_layout',
  'views/account/password_view',
  'models/user'],
  function (Backbone, parsley, FlyingFocus, MainContainer, PersonalView, CreditCardView, BankAccountView, PasswordView, UserModel) {

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
        this.model.set("cards", window.cards);
        this.model.set("bank_accounts", window.bank_account);
        FlyingFocus();
      },

      personal: function () {
        this.personalView = new PersonalView({model: this.model});
        this.mainContainer.switchToView(this.personalView);
        this.mainContainer.switchTab($('#personal'));
        $('.account_personal_form').parsley();
      },

      password: function () {
        this.passwordView = new PasswordView({model: this.model});
        this.mainContainer.switchToView(this.passwordView);
        this.mainContainer.switchTab($('#password'));
      },

      creditCard: function () {
        this.creditCardView = new CreditCardView({model: this.model});
        this.mainContainer.switchToView(this.creditCardView);
        this.mainContainer.switchTab($('#creditcard'));
      },

      bankAccount: function () {
        this.bankAccountView = new BankAccountView({model: this.model});
        this.mainContainer.switchToView(this.bankAccountView);
        this.mainContainer.switchTab($('#bankaccount'));
      }

    });

return AccountRouter;

}
);