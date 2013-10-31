
define(['backbone', 'handlebars', 'noty', 'noty-inline', 'noty-default', 'views/agreement/read/header_states/base_state',
  'text!templates/agreement/accept_tpl.html', 'views/agreement/read/modals/reject', 'views/ui-modules/modal',
  'views/agreement/read/modals/accept_payment'],

  function (Backbone, Handlebars, noty, noty_layout, noty_default, BaseState, payTemplate, RejectModal,
    Modal, AcceptModal) {

    'use strict';

    var SubmittedState = BaseState.extend({

      payTemplate: Handlebars.compile(payTemplate),

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
            console.log("new accept");
            var view = new AcceptModal({collection:this.model.get("payments"), user:this.user, otherUser: this.otherUser});
            this.acceptModal = new Modal({view:view});
          } 
          this.acceptModal.show();
        }
        else{
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