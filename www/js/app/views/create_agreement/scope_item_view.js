/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'hbs!templates/create_agreement/scope_item_tpl'],

  function (Backbone, Handlebars, _, itemTemplate) {

    'use strict';

    var WorkScopeItemView = Backbone.View.extend({

      tagName:'li',
      template: itemTemplate,

      initialize: function (options) {
        this.router = options.router;

        // if there is a model passed, use it
        if (options.collection) {
          this.model = options.collection;
        }
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
        event.preventDefault();
        this.model.collection.remove(this.model);
        $(event.currentTarget).parent().parent().remove();
      },
      block: function(event){
        event.stopPropagation();
      }

});

    return WorkScopeItemView;

  }
  );