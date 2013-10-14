define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/account/creditcard_layout.html', 'views/account/new_card_view', 'views/account/stored_cards_view'],

  function (Backbone, Handlebars, _, Marionette, layoutTpl, NewCardView, StoredCardsView) {

    'use strict';

    var Layout = Backbone.Marionette.Layout.extend({
      className:'clear',

      attributes:{'id':'content'},
      template: Handlebars.compile(layoutTpl),

      regions: {
        storedCards: "#stored-cards",
        newCard: "#new-card"
      },

      initialize: function(){
        this.render();
      },
      onRender:function(){
        this.newCard.show(new NewCardView({user: this.model}));
        this.storedCards.show(new StoredCardsView({collection: this.model.get("cards")}));
      }
    });

    return Layout;

  }
  );