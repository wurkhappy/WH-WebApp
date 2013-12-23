define(['backbone', 'handlebars', 'toastr', 'hbs!templates/create_agreement/send_tpl',
  'views/agreement/read/modals/payment_request', 'views/ui-modules/modal'],

  function (Backbone, Handlebars, toastr, tpl, DepositRequestModal, Modal) {

    'use strict';

    var SendView = Backbone.View.extend({
      template: tpl,
      className:'clear white_background',
      events:{
        "click #sendAgreement": "debounceSendAgreement",
        "blur textarea": "addMessage",
        "blur input": "addRecipient",
        "click #requestDeposit": "requestDeposit"
      },
      initialize:function(options){
        this.message = "Please take a moment to look over the details of the services provided, refund policies and payment schedule to confirm that's what you want to do and you're comfortable with the agreement.";
        this.user = options.user;
        this.otherUser = options.otherUser;
        this.render();
      },
      render: function(){
        this.deposit = this.model.get("payments").at(0);
        var deposit;

        if (this.deposit && this.deposit.get("required") && this.deposit.get("amount") > 0 && this.user.id === this.model.get("freelancerID")) {
          deposit = true;
        }
        var otherUserEmail = (this.otherUser) ? this.otherUser.get("email") : null;
        this.$el.html(this.template({
          message: this.message,
          deposit: deposit,
          otherUserEmail: otherUserEmail,
        }));
        $('body').scrollTop(0);

        return this;
      },

      debounceSendAgreement: function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.sendAgreement();
      },
      sendAgreement: _.debounce(function(event){

        if (!this.model.get("clientID") && !this.model.get("clientEmail")) return;

        var that = this;

        this.model.save({},{success:function(model, response){

          toastr.success('Agreement Sent');

          var changeWindow = function () {
            window.location = "/home";
          };
          var submitSuccess = _.debounce(changeWindow, 800); //delay the change in window until after success notification

          that.model.submit(that.message, submitSuccess);
        }});
      }, 500, true),
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
            var view = new DepositRequestModal({
              model: that.deposit,
              collection: that.model.get("payments"),
              cards: that.user.get("cards"),
              bankAccounts: that.user.get("bank_accounts"),
              acceptsBankTransfer: that.model.get("acceptsBankTransfer"),
              acceptsCreditCard: that.model.get("acceptsCreditCard")
            });
            that.modal = new Modal({view:view});
            that.listenTo(that.modal.view, "paymentRequested", that.depositRequested);
          } 
          that.modal.show();
        }});        
      },
      depositRequested: function(creditSource){
        if (!this.model.get("clientID") && !this.model.get("clientEmail")) return;

        var that = this;

        this.model.save({},{success:function(model, response){

          //toastr.success('Agreement Sent and Deposit Requested');

          var submitSuccess = function(){
            that.modal.view.model.submit(creditSource, function(){
              window.location = "/home";
            });
          };

          that.model.submit(that.message, submitSuccess);
        }});      
      }
    });

return SendView;

}
);