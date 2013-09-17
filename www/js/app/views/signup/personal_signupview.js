/*
 * Personal Signup View.
 */

define(['backbone', 'handlebars', 'text!templates/signup/personal.html'],

    function (Backbone, Handlebars, personalTemplate) {

      'use strict';

      var PersonalView = Backbone.View.extend({

        el: '#content',

        // Compile our footer template.
        template: Handlebars.compile(personalTemplate),

        initialize: function () {

          this.render();

        },

        render: function () {

          // Update el with the cached template.
          $(this.el).html(this.template());

          return this;

        }

      });

      return PersonalView;

    }
);