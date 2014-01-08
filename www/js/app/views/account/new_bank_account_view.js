/*
 * New Bank Account View.
 */

 define(['jquery', 'backbone', 'handlebars', 'toastr', 'hbs!templates/account/new_bank_account_tpl'],

  function ($, Backbone, Handlebars, toastr, Template) {

    'use strict';

    var NewBankAccountView = Backbone.View.extend({

      template: Template,
      events:{
        "blur input":"updateFields",
        "click #save-button":"debounceSaveBankAccount",
        "change select":"updateFields"
      },

      initialize: function (options) {
        this.user = options.user;
        if (this.user.get("firstName")) var name = this.user.attributes.firstName + ' ' + this.user.attributes.lastName;
        this.account = { name: name, type:"checking"};
        this.render();
      },

      render: function () {
        this.$el.html(this.template(this.account));
        return this;
      },
      updateFields:function(event){
        this.account[event.target.name] = event.target.value;
      },

      debounceSaveBankAccount: function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.saveBankAccount();
      },

      saveBankAccount:_.debounce(function(event){
        var that = this;
        balanced.bankAccount.create(this.account, function (response) {
          if(response.status === 201) {
            delete response.data.id;
            var model = new that.user.attributes["bank_accounts"].model(response.data);
            that.user.get("bank_accounts").add(model);
            model.save();
            that.$('input').val('');
            toastr.success('Bank Account Saved!');
            that.account = {type: "checking"};

          } else {
            console.log(response);
          }
        });
      }, 500, true)

    });

return NewBankAccountView;

}
);