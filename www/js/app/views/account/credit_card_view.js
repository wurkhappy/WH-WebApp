/*
 * Credit Card Account View.
 */

define(['backbone', 'handlebars', 'hbs!templates/account/creditcard'],

    function (Backbone, Handlebars, creditCardTemplate) {

      'use strict';

      var CreditCardView = Backbone.View.extend({

        className:'clear white_background',

        attributes:{'id':'content'},

        template: creditCardTemplate,

        initialize: function () {
          this.render();
        },

        render: function () {
          this.$el.html(this.template());
          return this;
        }

      });

      return CreditCardView;

    }
);