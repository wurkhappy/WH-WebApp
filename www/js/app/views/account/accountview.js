/*
 * Credit Card Account View.
 */

define(['backbone', 'handlebars', 'text!templates/account/account.html'],

    function (Backbone, Handlebars, accountTemplate) {

      'use strict';

      var AccountView = Backbone.View.extend({

        el: '#content',

        // Compile our footer template.
        template: Handlebars.compile(accountTemplate),

        initialize: function () {

          this.render();

        },

        render: function () {

          // Update el with the cached template.
          $(this.el).html(this.template());

          return this;

        }

      });

      return AccountView;

    }
);