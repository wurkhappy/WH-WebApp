
define(['backbone', 'handlebars', 'toastr', 'views/agreement/read/header_states/base_state',
  'hbs!templates/agreement/accept_tpl', 'views/agreement/read/modals/reject', 'views/ui-modules/modal',
  'views/account/new_card_view', 'views/account/new_bank_account_view'],

  function (Backbone, Handlebars, toastr, BaseState, payTemplate, RejectModal, Modal, NewCardView, NewBankAccountView) {

    'use strict';

    var AcceptPayment = Backbone.View.extend({

      payTemplate: payTemplate,

      initialize:function(options){
        this.button1Title = (this.userIsClient) ? "Accept " + this.statusType : "Waiting for Response"; 
        this.user = options.user;
        this.user.get("cards").fetch();
        this.user.get("bank_accounts").fetch();

        this.listenTo(this.user.get("cards"), "add", this.render);
        this.listenTo(this.user.get("bank_accounts"), "add", this.render);

        this.otherUser = options.otherUser;

        this.acceptsBankTransfer = options.acceptsBankTransfer;
        this.acceptsCreditCard = options.acceptsCreditCard;

        this.bankAccounts = this.user.get("bank_accounts");
        this.creditCards = this.user.get("cards");

        this.render();
      },
      render:function(){
        var milestonePayment = this.model.getTotalAmount();
        var amountTotal = milestonePayment;
        var creditCards = this.creditCards;
        var bankAccounts = this.bankAccounts;
        var acceptsBankTransfer = this.acceptsBankTransfer;
        var acceptsCreditCard = this.acceptsCreditCard;
        

        this.$el.html(this.payTemplate({
          milestonePayment: milestonePayment,
          amountTotal: amountTotal,
          creditCards: creditCards.toJSON(),
          bankAccounts: bankAccounts.toJSON(),
          acceptsCreditCard: acceptsCreditCard,
          acceptsBankTransfer: acceptsBankTransfer
        }));

        $(".payment_select_container").hide();
      },

      events: {
        "click #accept-button": "acceptRequest",
        "click .select_radio": "selectPaymentMethod",
        "click #add_card": "addCreditCard",
        "click #add_account": "addBankAccount",
        "click #back-button": "backToMain"
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
        event.preventDefault();
        event.stopPropagation();

        if (this.acceptsCreditCard && this.creditCards.length < 1){
          toastr.error('Please add a credit card to your account to make payment');
          return;
        }

        var bankAccount = $(".select_bank_account:checked").val();
        var canDebit = $(".select_bank_account:checked").attr('data-debit');
        var creditCard = $(".select_credit_card:checked").val()
        var $debitSource =  bankAccount || creditCard || '';
        var paymentType = (bankAccount) ? "BankBalanced" : "CardBalanced";

        if (!$debitSource) {
          toastr.error('Please select a credit card or bank account');
          return;
        }

        
        if ($debitSource === bankAccount && !canDebit) {
          toastr.error('Please verify your bank account in order to make payment');
          return;
        } else {
          this.model.accept($debitSource, paymentType);

          var fadeInNotification = function () {
            toastr.success('Payment Accepted');
          };

          var triggerNotification = _.debounce(fadeInNotification, 300);
          this.trigger('hide');
          triggerNotification();
          analytics.track('Payment Made');
        }
        
      },
      addCreditCard: function(){
        event.preventDefault();
        event.stopPropagation();

        var view =  new NewCardView({user:this.user});
        this.listenTo(view, 'cardSaved', this.backToMain);
        this.$('#addView').append(view.el);

        this.addPaymentMethodAnimate(550);
      },
      addBankAccount: function(){
        event.preventDefault();
        event.stopPropagation();

        var view =  new NewBankAccountView({user:this.user});
        this.listenTo(view, 'accountSaved', this.backToMain);
        this.$('#addView').append(view.el);
        
        this.addPaymentMethodAnimate(650);
      },
      addPaymentMethodAnimate: function(height){
        var panel = $('#panel')
        this.$('#addView').animate({'margin-top':'-'+panel.height()+'px', "height":panel.height()});
        $('#panel').height(height);
      },
      backToMain: function(){
        this.$('#addView').animate({"margin-left":"-500px"});
        setTimeout(_.bind(function(){
          this.$('#addView').css({"margin-top":"50px", "margin-left":"-20px"});
          this.render();
        }, this), 1000);
        $('#panel').css({'height':'auto'});
      }

    });

return AcceptPayment;

}
);
