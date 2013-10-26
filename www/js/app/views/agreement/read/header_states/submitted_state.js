
define(['backbone', 'handlebars', 'views/agreement/read/header_states/base_state', 'text!templates/agreement/accept_tpl.html', 'text!templates/agreement/reject_tpl.html'],

  function (Backbone, Handlebars, BaseState, payTemplate, rejectTemplate) {

    'use strict';

    var SubmittedState = BaseState.extend({

      el: "#popup_container",

      payTemplate: Handlebars.compile(payTemplate),
      rejectTemplate: Handlebars.compile(rejectTemplate),


      initialize:function(options){
        BaseState.prototype.initialize.apply(this);
        this.button1Title = (this.userIsClient) ? "Accept " + this.statusType : null; 
        this.button2Title = (this.userIsClient) ? "Reject " + this.statusType : null;
        this.user = options.user;
        this.user.get("cards").fetch();
        this.user.get("bank_accounts").fetch();

        this.otherUser = window.otherUser;
      },
      button1:function(event){
        //we don't check for userIsClient here because if title is null then button doesn't call action
        if (this.statusType === 'payment') {

          var milestonePayment = this.model.get("payments").findSubmittedPayment().get("amount");
          var amountTotal = milestonePayment;
          var creditCards = this.user.get("cards").toJSON();
          var bankAccounts = this.user.get("bank_accounts").toJSON();

          this.$el.html(this.payTemplate({
            milestonePayment: milestonePayment,
            amountTotal: amountTotal,
            creditCards: creditCards,
            bankAccounts: bankAccounts
          }));

          $('#overlay').fadeIn('slow');

          $(".payment_select_container").hide();

        }
        else{
          this.model.accept();
        }
      },
      button2:function(event){

        this.$el.html(this.rejectTemplate({
          status: this.statusType,
          otherUser: this.otherUser
        }));

        $('#overlay').fadeIn('slow');
        
      },

      events: {
        "click .close": "closeModal",
        "click #accept-button": "acceptRequest",
        "click #reject-button": "rejectRequest",
        "click .select_radio": "selectPaymentMethod"
      },

      closeModal: function(event) {
        $('#overlay').fadeOut('slow');
      },

      paymentTotal: function (milestonePayment, fee) {
        return milestonePayment - fee;
      },

      rejectRequest: function(event) {

        if (this.statusType === 'payment') {
           this.model.get("payments").findSubmittedPayment().reject();
        } else{
          this.model.reject();
        }
      },

      selectPaymentMethod: function(event) {

        var $radio = $(event.target),
            $type = $radio.val();

        $(".payment_select_container").not("#"+$type).slideUp("fast");
        $("#"+$type).slideDown("fast");
      },

      acceptRequest: function(event) {

        var $debitSource = $(".select_bank_account:checked").val() || $(".select_credit_card:checked").val() || '';

        this.model.get("payments").findSubmittedPayment().accept($debitSource);

        $('#overlay').fadeOut('slow');
      }

    });

    return SubmittedState;

  }
  );