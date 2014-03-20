define(['backbone', 'handlebars', 'underscore', 'marionette',
  'hbs!templates/account/creditcard_layout', 'views/account/new_card_view', 'views/account/stored_cards_view'],

  function (Backbone, Handlebars, _, Marionette, layoutTpl, NewCardView, StoredCardsView) {

    'use strict';

    var Layout = Backbone.Marionette.Layout.extend({
      className:'clear white_background layout_container',

      attributes:{'id':'content'},
      template: layoutTpl,

      regions: {
        storedCards: "#stored-cards",
        newCard: "#new-card"
      },

      initialize: function(){
        this.render();
      },
      onRender:function(){
        this.model.get("cards").fetch();
        this.newCard.show(new NewCardView({user: this.model}));
        this.storedCards.show(new StoredCardsView({collection: this.model.get("cards")}));
      }
    });

    return Layout;

  }
  );