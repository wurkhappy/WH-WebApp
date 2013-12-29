
define(['backbone', 'handlebars', 'views/agreement/read/header_states/base_state',
  'hbs!templates/agreement/accept_tpl', 'views/agreement/read/modals/reject', 'views/ui-modules/modal',
  'views/agreement/read/modals/accept_payment'],

  function (Backbone, Handlebars, BaseState, payTemplate, RejectModal,
    Modal, AcceptModal) {

    'use strict';

    var SubmittedState = BaseState.extend({

      payTemplate: payTemplate,

      initialize:function(options){
        BaseState.prototype.initialize.apply(this);
        this.button1Title = (!this.userIsStateCreator) ? "Accept " + this.statusType : "Waiting for Response"; 
        this.button2Title = (!this.userIsStateCreator) ? "Reject " + this.statusType : null;
        this.user = options.user;
        this.otherUser = options.otherUser;
      },
      button1:function(event){
        // if (!this.userIsClient || this.userIsStateCreator) return;
        var deposit = (this.userIsClient) ? this.model.get("payments").findFirstRequiredPayment() : null;
        if (this.statusType === 'payment') {
          if (!this.acceptModal){
            var view = new AcceptModal({
              model:this.model.get("payments").findSubmittedPayment(),
              user:this.user,
              otherUser: this.otherUser,
              acceptsBankTransfer: this.model.get("acceptsBankTransfer"),
              acceptsCreditCard: this.model.get("acceptsCreditCard")
            });
            this.acceptModal = new Modal({view:view});
          } 
          this.acceptModal.show();

        } else if (deposit && deposit.get("currentStatus").get("action") === "submitted" && this.userIsClient){

          if (!this.depositModal){
            var view = new AcceptModal({
              model:this.model.get("payments").findFirstRequiredPayment(),
              user:this.user,
              otherUser: this.otherUser,
              acceptsBankTransfer: this.model.get("acceptsBankTransfer"),
              acceptsCreditCard: this.model.get("acceptsCreditCard")
            });
            this.depositModal = new Modal({view:view});
          } 
          this.depositModal.show();   

        } else{
          this.model.accept();
        }
      },
      button2:function(event){
        var model = (this.statusType === 'payment') ? this.model.get("payments").findFirstOutstandingPayment() : this.model;
        if (!this.rejectModal){
          console.log("new reject");
          var view = new RejectModal({model:model, otherUser: this.otherUser});
          this.rejectModal = new Modal({view:view});
        } 
        this.rejectModal.show();

      }

    });

return SubmittedState;

}
);