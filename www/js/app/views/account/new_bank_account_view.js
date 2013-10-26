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
        this.user = options.user;
        if (this.user.get("firstName")) var name = this.user.attributes.firstName + ' ' + this.user.attributes.lastName;
        this.account = { name: name, type:"checking"};
        console.log(this.user);
        this.render();
      },

      render: function () {
        this.$el.html(this.template(this.account));
        return this;
      },
      updateFields:function(event){
        this.account[event.target.name] = event.target.value;
        console.log(this.account);
      },
      saveBankAccount:function(event){
        event.preventDefault();
        var that = this;
        balanced.bankAccount.create(this.account, function (response) {
          if(response.status === 201) {
            delete response.data.id;
            console.log(that.user.get("bank_accounts"));
            var model = new that.user.attributes["bank_accounts"].model(response.data);
            that.user.get("bank_accounts").add(model);
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