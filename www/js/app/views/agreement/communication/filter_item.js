
define(['backbone', 'handlebars', 'hbs!templates/agreement/communication/filter_item'],

  function (Backbone, Handlebars, scopeItemTpl) {

    'use strict';

    var FilterItem = Backbone.View.extend({

      template: scopeItemTpl,
      className: "tag_filter",
      events:{
        "click":"toggleFilterActive"
      },

      render: function () {
        this.$el.html(this.template(this.model.toJSON()));

        return this;

      },
      toggleFilterActive: function(event) {
        $(event.currentTarget).toggleClass("tag_filter_active");
        this.trigger("tag_selected", this.model);
      }

    });

    return FilterItem;

  }
  );