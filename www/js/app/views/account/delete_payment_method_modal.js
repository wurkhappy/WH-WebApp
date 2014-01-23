define(['backbone', 'handlebars', 'underscore', 'hbs!templates/account/delete_payment_method_tpl'],

  function (Backbone, Handlebars, _, deletePaymentMethodTemplate) {

    'use strict';

    var DeletePaymentMethodModal = Backbone.View.extend({

      template: deletePaymentMethodTemplate,
      events: {
        "click #delete_payment_method":"deletePaymentMethod",
        "click #cancel": "cancel"
      },
      initialize: function () {
        this.render();
      },

      render: function () {
        this.$el.html(this.template());
        return this;
      },
      deletePaymentMethod: function(event){
        event.preventDefault();
        event.stopPropagation();
        this.model.destroy();

        var that = this;
        _.defer(function(){ that.trigger('hide');});


      },
      cancel: function(event){
        event.preventDefault();
        event.stopPropagation();
        this.trigger('hide');
      }

    });

    return DeletePaymentMethodModal;

  }
  );