
define(['backbone', 'handlebars', 'toastr', 'text!templates/agreement/pay_request_tpl.html',
  'text!templates/agreement/pay_request_methods_tpl.html', 'text!templates/agreement/pay_request_breakout.html'],

  function (Backbone, Handlebars, toastr, payRequestTemplate, paymentMethodsTpl, paymentBreakoutTpl) {

    'use strict';
    Handlebars.registerHelper('last_four_digits', function(number) {
      if (!number) return;
      return number.slice(-4);
    });
    var PaymentMethods = Backbone.View.extend({

      template: Handlebars.compile(paymentMethodsTpl),
      initialize: function(options){
        this.bankAccounts = options.bankAccounts;
        this.listenTo(this.bankAccounts, 'add', this.render);
        this.render();
      },
      render:function(){
        this.$el.html(this.template({bankAccounts: this.bankAccounts.toJSON()}));

        return this;
      }
    });

    var PaymentRequestModal = Backbone.View.extend({

      template: Handlebars.compile(payRequestTemplate),
      breakoutTpl : Handlebars.compile(paymentBreakoutTpl),

      initialize:function(options){
        this.bankAccounts = options.bankAccounts;
        this.bankAccounts.fetch();
        this.paymentMethodsView = new PaymentMethods({bankAccounts: this.bankAccounts});
        this.render();
      },

      render:function(event){
        this.$el.html(this.template(_.extend({
          payments: this.collection.toJSON(),
        }, this.calculatePayment())));

        this.$('header').html(this.paymentMethodsView.$el);
      },

      events: {
        "click #pay-button": "requestPayment",
        "change #milestoneToPay":"updateView",
        "click #show_fee_detail": "showFeeDetail"
      },
      calculatePayment: function(){
        var milestonePayment = this.model.get("amount");
        var wurkHappyFee = milestonePayment * .05;
        var bankTransferFee = 5;
        var creditCardFee = (milestonePayment * .029) +.3;
        var feeTotal = creditCardFee+wurkHappyFee;
        var amountTotal = milestonePayment - feeTotal;


        return {
          milestonePayment: milestonePayment.toFixed(2),
          wurkHappyFee: wurkHappyFee.toFixed(2),
          bankTransferFee: bankTransferFee.toFixed(2),
          creditCardFee: creditCardFee.toFixed(2),
          feeTotal: feeTotal.toFixed(2),
          amountTotal: amountTotal.toFixed(2)
        }
      },
      updateView: function(event){
        var id = event.target.value;
        this.model = this.collection.get(id);
        this.$('#paymentBreakout').html(this.breakoutTpl(this.calculatePayment()))
      },
      requestPayment: function (event) {

        var fadeOutModal = function () {
          $('#overlay').fadeOut('fast');
        };

        var fadeInNotification = function () {
          toastr.success('Payment requested and email sent');
        };

        var triggerNotification = _.debounce(fadeInNotification, 300);

        fadeOutModal();
        triggerNotification();

        var creditSource = this.$(".select_bank_account:checked").attr("value") || '';
        this.trigger("paymentRequested", creditSource);
        this.trigger('hide');
      },

      showFeeDetail: function(event) {
        event.preventDefault();
        event.stopPropagation();
        $('.fee_detail_container').slideToggle('slow');
      }

    });

return PaymentRequestModal;

}
);