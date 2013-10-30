
define(['backbone', 'handlebars', 'text!templates/agreement/pay_request_tpl.html', 'text!templates/agreement/pay_request_methods_tpl.html'],

  function (Backbone, Handlebars, payRequestTemplate, paymentMethodsTpl) {

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

      el: "#popup_container",

      template: Handlebars.compile(payRequestTemplate),

      initialize:function(options){
        this.bankAccounts = options.bankAccounts;
        this.bankAccounts.fetch();
        this.paymentMethodsView = new PaymentMethods({bankAccounts: this.bankAccounts});
        this.render();
      },

      render:function(event){
          var milestonePayment = this.model.get("amount");
          var wurkHappyFee = milestonePayment * .05;
          var amountTotal = this.paymentTotal(milestonePayment, wurkHappyFee);

          this.$el.append(this.template({
            milestonePayment: milestonePayment,
            wurkHappyFee: wurkHappyFee,
            amountTotal: amountTotal,
          }));

          this.$('header').html(this.paymentMethodsView.$el);

      },

      events: {
        "click .close": "closeModal",
        "click #pay-button": "requestPayment"
      },
      show: function(){
        $('#overlay').fadeIn('slow');
      },
      closeModal: function(event) {
        $('#overlay').fadeOut('slow');
      },

      paymentTotal: function (milestonePayment, fee) {
        return milestonePayment - fee;
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

        $('#overlay').fadeOut('slow');
      }

    });

return PaymentRequestModal;

}
);