
define(['backbone', 'handlebars', 'views/agreement/read/header_states/base_state', 'views/agreement/read/modals/payment_request', 'views/ui-modules/modal'],

  function (Backbone, Handlebars, BaseState, PaymentRequestModal, Modal) {

    'use strict';

    var AcceptedState = BaseState.extend({

      initialize:function(options){
        BaseState.prototype.initialize.apply(this);
        this.button1Title = (this.userIsClient) ? null : "Request Payment"; 
        this.button2Title = (this.userIsClient) ? null : "Edit Agreement";

        this.user = options.user;
      },

      button1:function(event){
        if (!this.modal){
          var view = new PaymentRequestModal({
            model:this.model.get("workItems").findFirstOutstanding(),
            collection: this.model.get("workItems").findAllOutstanding(),
            payments: this.model.get("payments"),
            cards: this.user.get("cards"),
            bankAccounts: this.user.get("bank_accounts"),
            acceptsBankTransfer: this.model.get("acceptsBankTransfer"),
            acceptsCreditCard: this.model.get("acceptsCreditCard")
          });
          this.modal = new Modal({view:view});
        } 
        this.modal.show();
      },

      button2:function(event){
        this.edit()
      }

    });

return AcceptedState;

}
);