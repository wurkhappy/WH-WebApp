
define(['backbone', 'handlebars', 'noty', 'noty-inline', 'noty-default', 'views/agreement/read/header_states/base_state',
  'text!templates/agreement/accept_tpl.html', 'views/agreement/read/modals/reject', 'views/ui-modules/modal'],

  function (Backbone, Handlebars, noty, noty_layout, noty_default, BaseState, payTemplate, RejectModal, Modal) {

    'use strict';

    var AcceptPayment = Backbone.View.extend({

      payTemplate: Handlebars.compile(payTemplate),

      initialize:function(options){
        this.button1Title = (this.userIsClient) ? "Accept " + this.statusType : "Waiting for Response"; 
        this.user = options.user;
        this.user.get("cards").fetch();
        this.user.get("bank_accounts").fetch();

        this.otherUser = options.otherUser;
        this.render();
      },
      render:function(){
        var milestonePayment = this.collection.findSubmittedPayment().get("amount");
        var amountTotal = milestonePayment;
        var creditCards = this.user.get("cards").toJSON();
        var bankAccounts = this.user.get("bank_accounts").toJSON();

        this.$el.html(this.payTemplate({
          milestonePayment: milestonePayment,
          amountTotal: amountTotal,
          creditCards: creditCards,
          bankAccounts: bankAccounts
        }));

        $(".payment_select_container").hide();
      },

      events: {
        "click #accept-button": "acceptRequest",
        "click .select_radio": "selectPaymentMethod"
      },

      paymentTotal: function (milestonePayment, fee) {
        return milestonePayment - fee;
      },

      selectPaymentMethod: function(event) {

        var $radio = $(event.target),
        $type = $radio.val();

        $(".payment_select_container").not("#"+$type).slideUp("fast");
        $("#"+$type).slideDown("fast");
      },

      acceptRequest: function(event) {

        var $debitSource = $(".select_bank_account:checked").val() || $(".select_credit_card:checked").val() || '';

        this.collection.findSubmittedPayment().accept($debitSource);

        var status;

        if (this.statusType) {
          status = this.statusType;
        } else {
          status = "";
        }

        var fadeInNotification = function () {
          $(".notification_container").fadeIn("fast");
          $(".notification_text").text("Request "+status+" and email sent");
        };

        $(".notification_container").hover( function() {
          $(".notification_container").fadeOut("fast");
        });

        var triggerNotification = _.debounce(fadeInNotification, 300);

        this.trigger('hide');
        triggerNotification();
      },

    });

return AcceptPayment;

}
);