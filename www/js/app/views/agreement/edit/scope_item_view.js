
define(['backbone', 'handlebars', 'text!templates/agreement/edit/scope_item_tpl.html'],

  function (Backbone, Handlebars, scopeItemTpl) {

    'use strict';

    var ScopeItemView = Backbone.View.extend({

      template: Handlebars.compile(scopeItemTpl),

      render: function () {
        this.$el.html(this.template(this.model.toJSON()));

        return this;

      },
      events:{
        "click a" : "removeItem"
      },
      removeItem: function(event){
        this.model.collection.remove(this.model);
      },

    });

    return ScopeItemView;

  }
  );