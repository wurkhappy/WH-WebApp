/*
 * Signup View.
 */

define(['backbone', 'handlebars', 'text!templates/signup/signup.html'],

    function (Backbone, Handlebars, signupTemplate) {

      'use strict';

      var SignupView = Backbone.View.extend({

        el: '#content',

        // Compile our footer template.
        template: Handlebars.compile(signupTemplate),

        initialize: function () {

          this.render();

        },

        render: function () {

          // Update el with the cached template.
          $(this.el).html(this.template());

          return this;

        }

      });

      return SignupView;

    }
);