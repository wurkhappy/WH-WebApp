
define(['backbone', 'handlebars', 'text!templates/agreement/scope_item_tpl.html'],

  function (Backbone, Handlebars, scopeItemTpl) {

    'use strict';

    var PaymentItemView = Backbone.View.extend({

      template: Handlebars.compile(scopeItemTpl),

      render: function () {
        this.$el.html(this.template(this.model.toJSON()));

        return this;

      }

    });

    return PaymentItemView;

  }
  );