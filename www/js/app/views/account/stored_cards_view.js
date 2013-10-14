define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/account/stored_card_item.html', 'text!templates/account/stored_cards.html'],

  function (Backbone, Handlebars, _, Marionette, itemTpl, storedCardsTpl) {

    'use strict';

    var ItemView = Backbone.Marionette.CollectionView.extend({

      template: Handlebars.compile(itemTpl),

      events: {
        "click a":"removeModel"
      },
      render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      },
      removeModel:function(){
        this.model.destroy();
      }
    });

    var StoredCardsView = Backbone.Marionette.CompositeView.extend({
      template: Handlebars.compile(storedCardsTpl),
      itemView: ItemView,
      itemViewContainer:'table',
      events: {
      },

      initialize:function(){
        this.render();
      }
    });

    return StoredCardsView;

  }
  );
