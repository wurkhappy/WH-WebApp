
define(['backbone', 'handlebars', 'noty', 'noty-inline', 'noty-default', 'views/agreement/read/header_states/base_state',
  'text!templates/agreement/accept_tpl.html', 'views/agreement/read/modals/reject'],

  function (Backbone, Handlebars, noty, noty_layout, noty_default, BaseState, payTemplate, RejectModal) {

    'use strict';

    var SubmittedState = BaseState.extend({

      el: "#popup_container",

      payTemplate: Handlebars.compile(payTemplate),

      initialize:function(options){
        BaseState.prototype.initialize.apply(this);
        this.button1Title = (this.userIsClient) ? "Accept " + this.statusType : null; 
        this.button2Title = (this.userIsClient) ? "Reject " + this.statusType : null;
        this.user = options.user;
        this.user.get("cards").fetch();
        this.user.get("bank_accounts").fetch();

        this.otherUser = options.otherUser;
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
        var model = (this.statusType === 'payment') ? this.model.get("payments").findFirstOutstandingPayment() : this.model;
        if (!this.rejectModal) this.rejectModal = new RejectModal({model:model, otherUser: this.otherUser});
        this.rejectModal.show();
        
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

        var status;

        if (this.statusType) {
          status = this.statusType;
        } else {
          status = "";
        }

        var fadeOutModal = function () {
          $('#overlay').fadeOut('fast');
        };

        var fadeInNotification = function () {
          $(".notification_container").fadeIn("fast");
          $(".notification_text").text("Request "+status+" and email sent");
        };

        $(".notification_container").hover( function() {
          $(".notification_container").fadeOut("fast");
        });

        var triggerNotification = _.debounce(fadeInNotification, 300);

        fadeOutModal();
        triggerNotification();
      },

    });

    return SubmittedState;

  }
  );