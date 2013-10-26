define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/account/bank_account_layout.html', 'views/account/new_bank_account_view', 'views/account/stored_bank_accounts_view'],

  function (Backbone, Handlebars, _, Marionette, layoutTpl, NewBankAccountView, StoredBankAccountsView) {

    'use strict';
    Handlebars.registerHelper('last_four', function(number) {
      if (!number) return;
      return number.slice(-4);
    });

    var Layout = Backbone.Marionette.Layout.extend({
      className:'clear content',

      attributes:{'id':'content'},
      template: Handlebars.compile(layoutTpl),

      regions: {
        bankAccounts: "#stored-accounts",
        newBankAccount: "#new-account"
      },

      initialize: function(){
        this.render();
      },
      onRender:function(){
        this.model.get("bank_accounts").fetch();
        this.newBankAccount.show(new NewBankAccountView({user: this.model}));
        this.bankAccounts.show(new StoredBankAccountsView({collection: this.model.get("bank_accounts")}));
      }
    });

    return Layout;

  }
  );