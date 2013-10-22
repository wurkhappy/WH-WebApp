
define(['backbone', 'handlebars', 'views/agreement/read/header_states/base_state', 'text!templates/agreement/pay_tpl.html'],

  function (Backbone, Handlebars, BaseState, payTemplate) {

    'use strict';

    var SubmittedState = BaseState.extend({

      el: "#popup_container",

      template: Handlebars.compile(payTemplate),

      initialize:function(){
        BaseState.prototype.initialize.apply(this);
        this.button1Title = (this.userIsClient) ? "Accept " + this.statusType : null; 
        this.button2Title = (this.userIsClient) ? "Reject " + this.statusType : null;
      },
      button1:function(event){
        //we don't check for userIsClient here because if title is null then button doesn't call action
        if (this.statusType === 'payment') {

          var milestonePayment = 100 //this.model.get("payments").findSubmittedPayment();
          var wurkHappyFee = milestonePayment * .05;
          var amountTotal = this.paymentTotal(milestonePayment, wurkHappyFee);

          this.$el.append(this.template({
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
        if (this.statusType === 'payment') {
          this.model.get("payments").findSubmittedPayment().reject();
        }
        else{
          this.model.reject();
        }
      },

      events: {
        "click .close": "closeModal",
        "click #pay-button": "sendPaymentRequest"
      },

      closeModal: function(event) {
        $('#overlay').fadeOut('slow');
      },

      sendPaymentRequest: function(event) {

        this.model.get("payments").findSubmittedPayment().accept("debit");

      }

    });

    return SubmittedState;

  }
  );