define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/account/creditcard_layout.html', 'views/account/new_card_view'],

  function (Backbone, Handlebars, _, Marionette, layoutTpl, NewCardView) {

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
        this.newCard.show(new NewCardView({model: this.model}));
      }
    });

    return Layout;

  }
  );