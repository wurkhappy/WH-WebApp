
define(['backbone', 'handlebars', 'hbs!templates/agreement/edit/scope_item_tpl'],

  function (Backbone, Handlebars, scopeItemTpl) {

    'use strict';

    var ScopeItemView = Backbone.View.extend({

      template: scopeItemTpl,

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