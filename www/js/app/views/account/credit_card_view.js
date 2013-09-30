/*
 * Credit Card Account View.
 */

define(['backbone', 'handlebars', 'text!templates/account/creditcard.html'],

    function (Backbone, Handlebars, creditCardTemplate) {

      'use strict';

      var CreditCardView = Backbone.View.extend({

        className:'clear',

        attributes:{'id':'content'},

        template: Handlebars.compile(creditCardTemplate),

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