
define(['backbone', 'handlebars', 'text!templates/agreement/new_scope_item_tpl.html'],

  function (Backbone, Handlebars, scopeItemTpl) {

    'use strict';

    var ScopeItemView = Backbone.View.extend({

      template: Handlebars.compile(scopeItemTpl),
      className: "check_item",

      initialize: function() {
        console.log("something")
        this.render();
      },

      render: function () {
        this.$el.html(this.template(this.model.toJSON()));

        return this;

      }

    });

    return ScopeItemView;

  }
  );