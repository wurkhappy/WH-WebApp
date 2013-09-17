/*
 * Credit Card Account View.
 */

define(['backbone', 'handlebars', 'text!templates/account/creditcard.html'],

    function (Backbone, Handlebars, creditcardTemplate) {

      'use strict';

      var CreditCardView = Backbone.View.extend({

        el: '#content',

        // Compile our footer template.
        template: Handlebars.compile(creditcardTemplate),

        initialize: function () {

          this.render();

        },

        render: function () {

          // Update el with the cached template.
          $(this.el).html(this.template());

          return this;

        }

      });

      return CreditCardView;

    }
);