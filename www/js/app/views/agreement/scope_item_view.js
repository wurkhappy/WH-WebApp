
define(['backbone', 'handlebars', 'hbs!templates/agreement/scope_item_tpl'],

  function (Backbone, Handlebars, scopeItemTpl) {

    'use strict';

    var PaymentItemView = Backbone.View.extend({

      template: scopeItemTpl,

      render: function () {
        this.$el.html(this.template(this.model.toJSON()));

        return this;

      }

    });

    return PaymentItemView;

  }
  );