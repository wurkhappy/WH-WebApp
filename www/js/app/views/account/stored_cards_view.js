define(['backbone', 'handlebars', 'underscore', 'marionette',
  'hbs!templates/account/stored_card_item', 'hbs!templates/account/stored_cards'],

  function (Backbone, Handlebars, _, Marionette, itemTpl, storedCardsTpl) {

    'use strict';

    var ItemView = Backbone.Marionette.View.extend({

      template: itemTpl,

      events: {
        "click a":"removeModel"
      },
      initialize:function(){
        this.listenTo(this.model, "change", this.render);
      },
      render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        console.log(this.model.toJSON());
        return this;
      },
      removeModel:function(){
        event.preventDefault();
        event.stopPropagation();
        this.model.destroy();
      }
    });

    var StoredCardsView = Backbone.Marionette.CompositeView.extend({
      template: storedCardsTpl,
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
