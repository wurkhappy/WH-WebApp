
define(['backbone', 'handlebars', 'views/agreement/read/header_states/base_state', 'text!templates/agreement/pay_request_tpl.html'],

  function (Backbone, Handlebars, BaseState, payRequestTemplate) {

    'use strict';

    var AcceptedState = BaseState.extend({

      el: "#popup_container",

      template: Handlebars.compile(payRequestTemplate),

      initialize:function(){
        BaseState.prototype.initialize.apply(this);
        this.button1Title = (this.userIsClient) ? null : "Request Payment"; 
        this.button2Title = (this.userIsClient) ? null : "Edit Agreement";
      },

      button1:function(event){

        var milestonePayment = this.model.get("payments").findSubmittedPayment();
        var wurkHappyFee = milestonePayment * .05;
        var amountTotal = this.paymentTotal(milestonePayment, wurkHappyFee);

        this.$el.append(this.template({
          milestonePayment: milestonePayment,
          wurkHappyFee: wurkHappyFee,
          amountTotal: amountTotal
        }));

        $('#overlay').fadeIn('slow');
      },

      button2:function(event){
        this.edit()
      },

      events: {
        "click .close": "closeModal",
        "click #pay-button": "acceptPayment"
      },

      closeModal: function(event) {
        $('#overlay').fadeOut('slow');
      },

      paymentTotal: function (milestonePayment, fee) {
        return milestonePayment - fee;
      },

      acceptPayment: function (event) {

        this.model.get("payments").findFirstOutstandingPayment().submit("creditSource");
      }

    });

    return AcceptedState;

  }
  );