
define(['backbone', 'handlebars', 'noty', 'noty-inline', 'noty-default', 'views/agreement/read/header_states/base_state',
  'hbs!templates/agreement/accept_tpl.html', 'views/agreement/read/modals/reject', 'views/ui-modules/modal',
  'views/agreement/read/modals/accept_payment'],

  function (Backbone, Handlebars, noty, noty_layout, noty_default, BaseState, payTemplate, RejectModal,
    Modal, AcceptModal) {

    'use strict';

    var SubmittedState = BaseState.extend({

      payTemplate: payTemplate,

      initialize:function(options){
        BaseState.prototype.initialize.apply(this);
        this.button1Title = (this.userIsClient) ? "Accept " + this.statusType : "Waiting for Response"; 
        this.button2Title = (this.userIsClient) ? "Reject " + this.statusType : null;
        this.user = options.user;
        this.otherUser = options.otherUser;
      },
      button1:function(event){
        if (!this.userIsClient) return;

        if (this.statusType === 'payment') {
          if (!this.acceptModal){
            var view = new AcceptModal({model:this.model.get("payments").findSubmittedPayment(), user:this.user, otherUser: this.otherUser});
            this.acceptModal = new Modal({view:view});
          } 
          this.acceptModal.show();

        } else if (this.model.get("payments").findFirstRequiredPayment()){

          if (!this.depositModal){
            var view = new AcceptModal({model:this.model.get("payments").findFirstRequiredPayment(), user:this.user, otherUser: this.otherUser});
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