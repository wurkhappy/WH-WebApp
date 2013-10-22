
define(['backbone', 'handlebars', 'views/agreement/read/header_states/base_state', 'text!templates/agreement/accept_tpl.html', 'text!templates/agreement/reject_tpl.html'],

  function (Backbone, Handlebars, BaseState, payTemplate, rejectTemplate) {

    'use strict';

    var SubmittedState = BaseState.extend({

      el: "#popup_container",

      payTemplate: Handlebars.compile(payTemplate),
      rejectTemplate: Handlebars.compile(rejectTemplate),


      initialize:function(){
        BaseState.prototype.initialize.apply(this);
        this.button1Title = (this.userIsClient) ? "Accept " + this.statusType : null; 
        this.button2Title = (this.userIsClient) ? "Reject " + this.statusType : null;
      },
      button1:function(event){
        //we don't check for userIsClient here because if title is null then button doesn't call action
        if (this.statusType === 'payment') {

          var milestonePayment = this.model.get("payments").findSubmittedPayment().get("amount");
          var wurkHappyFee = milestonePayment * .05;
          var amountTotal = this.paymentTotal(milestonePayment, wurkHappyFee);

          this.$el.html(this.payTemplate({
            milestonePayment: milestonePayment,
            wurkHappyFee: wurkHappyFee,
            amountTotal: amountTotal
          }));

          $('#overlay').fadeIn('slow');

        }
        else{
          this.model.accept();
        }
      },
      button2:function(event){

        this.$el.html(this.rejectTemplate({
          status: this.statusType
        }));

        $('#overlay').fadeIn('slow');
        
      },

      events: {
        "click .close": "closeModal",
        "click #accept-button": "acceptRequest",
        "click #reject-button": "rejectRequest"
      },

      closeModal: function(event) {
        $('#overlay').fadeOut('slow');
      },

      acceptRequest: function(event) {
        this.model.get("payments").findSubmittedPayment().accept("debit");
      },

      paymentTotal: function (milestonePayment, fee) {
        return milestonePayment - fee;
      },

      rejectRequest: function(event) {

        if (this.statusType === 'payment') {

           this.model.get("payments").findSubmittedPayment().reject();
          
        }
        else{
          this.model.reject();
        }

      }

    });

    return SubmittedState;

  }
  );