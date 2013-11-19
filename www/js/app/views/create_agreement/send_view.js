define(['backbone', 'handlebars', 'text!templates/create_agreement/send_tpl.html', 'views/agreement/read/modals/payment_request', 'views/ui-modules/modal'],

  function (Backbone, Handlebars, tpl, PaymentRequestModal, Modal) {

    'use strict';

    var SendView = Backbone.View.extend({
      template: Handlebars.compile(tpl),
      className:'clear white_background',
      events:{
        "click #sendAgreement": "sendAgreement",
        "blur textarea": "addMessage",
        "blur input": "addRecipient",
        "click #requestDeposit": "requestDeposit"
      },
      initialize:function(options){
        this.render();
        this.message = "Please take a moment to look over the details of the services provided, refund policies and payment schedule to confirm that's what you want to do and you're comfortable with the agreement.";
        this.user = options.user;
      },
      render: function(){
        this.deposit = this.model.get("payments").at(0);

        var deposit;

        if (this.deposit.isDeposit() && this.deposit.has("amount")) {
          deposit = true;
        }

        this.$el.html(this.template({
          message: this.message,
          deposit: deposit
        }));
      },
      sendAgreement: function(event){
        event.preventDefault();
        event.stopPropagation();

        if (!this.model.get("clientID") && !this.model.get("clientEmail")) return;

        var that = this;

        this.model.save({},{success:function(model, response){

          $('.notification_container').fadeIn('fast');

          var changeWindow = function () {
            window.location = "/home";
          };
          var submitSuccess = _.debounce(changeWindow, 800); //delay the change in window until after success notification

          that.model.submit(that.message, submitSuccess);
        }});
      },
      addRecipient: function(event){
        this.model.set("clientEmail", event.target.value);
      },
      addMessage: function(event){
        this.message = event.target.value
      },
      requestDeposit: function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (!this.model.get("clientID") && !this.model.get("clientEmail")) return;

        var that = this;

        this.model.save({},{success:function(model, response){
          if (!that.modal){
            var view = new PaymentRequestModal({model: that.deposit, collection: that.model.get("payments"), cards: that.user.get("cards"), bankAccounts: that.user.get("bank_accounts")});
            that.modal = new Modal({view:view});
          } 
          that.modal.show();
        }});        
      }
    });

return SendView;

}
);