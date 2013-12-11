
define(['backbone', 'handlebars', 'hbs!templates/agreement/payment_methods_tpl'],

  function (Backbone, Handlebars, paymentMethodsTpl) {

    'use strict';

    var PaymentMethodsView = Backbone.View.extend({

      template: paymentMethodsTpl,

      render: function () {
        this.$el.html(this.template({
          model: this.model.toJSON()
      }));

        return this;

      }

    });

    return PaymentMethodsView;

  }
  );