
define(['backbone', 'handlebars', 'views/agreement/read/header_states/base_state', 'views/agreement/read/modals/payment_request'],

  function (Backbone, Handlebars, BaseState, PaymentRequestModal) {

    'use strict';

    var AcceptedState = BaseState.extend({

      initialize:function(options){
        BaseState.prototype.initialize.apply(this);
        this.button1Title = (this.userIsClient) ? null : "Request Payment"; 
        this.button2Title = (this.userIsClient) ? null : "Edit Agreement";

        this.user = options.user;
      },

      button1:function(event){
        if (!this.modal) this.modal = new PaymentRequestModal({model:this.model.get("payments").findFirstOutstandingPayment(), collection: this.model.get("payments").findAllOutstandingPayment(), cards: this.user.get("cards"), bankAccounts: this.user.get("bank_accounts")});
        this.modal.show();
      },

      button2:function(event){
        this.edit()
      }

    });

return AcceptedState;

}
);