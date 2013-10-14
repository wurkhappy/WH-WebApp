/*
 * New Bank Account View.
 */

 define(['jquery', 'backbone', 'handlebars', 'text!templates/account/new_bank_account_tpl.html'],

  function ($, Backbone, Handlebars, Template) {

    'use strict';

    var NewBankAccountView = Backbone.View.extend({

      template: Handlebars.compile(Template),
      events:{
        "blur input":"updateFields",
        "click #save-button":"saveBankAccount",
        "change select":"updateFields"
      },

      initialize: function (options) {
        this.render();
        this.account; // = {"expiration_month":1, "expiration_year":2013};
        this.user = options.user;
        console.log(this.user);
      },

      render: function () {
        this.$el.html(this.template());
        return this;
      },
      updateFields:function(event){
        this.account[event.target.name] = event.target.value;
      },
      saveBankAccount:function(event){
        var that = this;
        balanced.bankAccount.create(this.account, function (response) {
          if(response.status === 201) {
            delete response.data.id;
            console.log(that.user.get("bank_account"));
            var model = new that.user.attributes["bank_account"].model(response.data);
            that.user.get("bank_account").add(model);
            model.save();

          } else {
            console.log(response);
          }
        });
      }

    });

return NewBankAccountView;

}
);