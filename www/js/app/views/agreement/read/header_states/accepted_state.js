
define(['backbone', 'handlebars', 'views/agreement/read/header_states/base_state', 'text!templates/agreement/pay_request_tpl.html'],

  function (Backbone, Handlebars, BaseState, payRequestTemplate) {

    'use strict';

    var AcceptedState = BaseState.extend({

      el: "#popup_container",

      template: Handlebars.compile(payRequestTemplate),

      initialize:function(options){
        BaseState.prototype.initialize.apply(this);
        this.button1Title = (this.userIsClient) ? null : "Request Payment"; 
        this.button2Title = (this.userIsClient) ? null : "Edit Agreement";
        this.user = options.user;
      },

      button1:function(event){

        var milestonePayment = this.model.get("payments").findFirstOutstandingPayment().get("amount");
        var wurkHappyFee = milestonePayment * .05;
        var amountTotal = this.paymentTotal(milestonePayment, wurkHappyFee);
        var creditCards = this.user.get("cards").toJSON();
        var bankAccounts = this.user.get("bank_accounts").toJSON();

        this.$el.append(this.template({
          milestonePayment: milestonePayment,
          wurkHappyFee: wurkHappyFee,
          amountTotal: amountTotal,
          creditCards: creditCards,
          bankAccounts: bankAccounts 
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

        var $creditSource = $(".select_bank_account:checked").attr("name") || '';

        this.model.get("payments").findFirstOutstandingPayment().submit($creditSource);

        $('#overlay').fadeOut('slow');
      }

    });

    return AcceptedState;

  }
  );