/*
 * Password Account View.
 */

define(['backbone', 'handlebars', 'text!templates/account/password.html'],

    function (Backbone, Handlebars, passwordTemplate) {

      'use strict';

      var PasswordView = Backbone.View.extend({

        el: '#content',

        // Compile our footer template.
        template: Handlebars.compile(passwordTemplate),

        initialize: function () {

          this.render();

        },

        render: function () {

          // Update el with the cached template.
          $(this.el).html(this.template());

          return this;

        }

      });

      return PasswordView;

    }
);