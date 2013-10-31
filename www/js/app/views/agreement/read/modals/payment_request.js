
define(['backbone', 'handlebars', 'text!templates/agreement/pay_request_tpl.html',
  'text!templates/agreement/pay_request_methods_tpl.html', 'text!templates/agreement/pay_request_breakout.html'],

  function (Backbone, Handlebars, payRequestTemplate, paymentMethodsTpl, paymentBreakoutTpl) {

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
        "change #milestoneToPay":"updateView"
      },
      calculatePayment: function(){
        var milestonePayment = this.model.get("amount");
        var wurkHappyFee = milestonePayment * .05;
        var amountTotal = milestonePayment - wurkHappyFee;
        return {
          milestonePayment: milestonePayment,
          wurkHappyFee: wurkHappyFee,
          amountTotal: amountTotal,
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
          $(".notification_container").fadeIn("fast");
          $(".notification_text").text("Payment requested and email sent");
        };

        $(".notification_container").hover( function() {
          $(".notification_container").fadeOut("fast");
        });

        var triggerNotification = _.debounce(fadeInNotification, 300);

        fadeOutModal();
        triggerNotification();

        var creditSource = this.$(".select_bank_account:checked").attr("value") || '';

        this.model.submit(creditSource);
        this.trigger('hide');
      }

    });

return PaymentRequestModal;

}
);