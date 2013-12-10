define(['backbone', 'handlebars', 'hbs!templates/create_agreement/review_tpl', 'views/agreement/payments_read_view',
  'views/agreement/read/modals/agreement_submit', 'views/ui-modules/modal'],

  function (Backbone, Handlebars, tpl, PaymentsView, AgreementSubmitModal, Modal) {

    'use strict';

    var ReviewView = Backbone.View.extend({
      template: tpl,
      className:'clear white_background review_container',
      events: {
        "click #submitAgreement":"continue"
      },
      initialize:function(){
        this.render();
      },
      render: function(){
        var totalAmount = this.model.get("payments").getTotalAmount();

        this.$el.html(this.template({
          model: this.model.toJSON(),
          totalAmount: totalAmount
        }));
        var paymentsView = new PaymentsView({model: this.model});
        paymentsView.render();
        this.$('#payments-section') (paymentsView.$el);
        return this;
      },
      continue: function(event){
        event.preventDefault();
        event.stopPropagation();

        window.location.hash = '#send';

      }

    });

    return ReviewView;

  }
  );