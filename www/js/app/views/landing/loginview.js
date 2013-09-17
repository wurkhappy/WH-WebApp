/*
 * Login View.
 */

define(['backbone', 'handlebars', 'text!templates/landing/login.html'],

    function (Backbone, Handlebars, loginTemplate) {

      'use strict';

      var LoginView = Backbone.View.extend({

        // Compile our footer template.
        template: Handlebars.compile(loginTemplate),

        initialize: function () {

          //this.render();

        },

        render: function () {

          // Update el with the cached template.
          $(this.el).html(this.template());

          return this;

        }

      });

      return LoginView;

    }
);