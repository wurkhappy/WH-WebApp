define(['backbone', 'handlebars', 'text!templates/create_agreement/review_tpl.html', 'views/agreement/payments_read_view',
  'views/agreement/read/modals/agreement_submit', 'views/ui-modules/modal'],

  function (Backbone, Handlebars, tpl, PaymentsView, AgreementSubmitModal, Modal) {

    'use strict';

    var ReviewView = Backbone.View.extend({
      template: Handlebars.compile(tpl),
      className:'clear white_background review_container',
      events: {
        "click #submitAgreement":"submit"
      },
      initialize:function(){
        this.render();
      },
      render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        var paymentsView = new PaymentsView({model: this.model});
        paymentsView.render();
        this.$('#payments-section').html(paymentsView.$el);
        return this;
      },
      submit: function(){
        event.preventDefault();
        event.stopPropagation();
        if (!this.modal){
          var view = new AgreementSubmitModal({model:this.model});
          this.modal = new Modal({view:view});
        } 
        this.modal.show();
      }

    });

    return ReviewView;

  }
  );