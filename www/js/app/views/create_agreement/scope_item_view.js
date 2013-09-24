/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'text!templates/create_agreement/scope_item_tpl.html'],

  function (Backbone, Handlebars, _, itemTemplate) {

    'use strict';

    var PaymentScopeItemView = Backbone.View.extend({

      tagName:'li',
      template: Handlebars.compile(itemTemplate),

      initialize: function (options) {
        this.router = options.router;
        this.render();
      },

      render: function () {

        this.$el.html(this.template(this.model.toJSON()));

        return this;
      },
      events:{
        "click a" : "removeItem",
        "blur input":'block'
      },
      removeItem: function(event){
        this.model.collection.remove(this.model);
      },
      block: function(event){
        event.stopPropagation();
      }

});

    return PaymentScopeItemView;

  }
  );