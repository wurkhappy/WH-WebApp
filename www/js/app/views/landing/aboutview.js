/*
 * About View.
 */

define(['backbone', 'handlebars', 'text!templates/landing/about.html'],

    function (Backbone, Handlebars, aboutTemplate) {

      'use strict';

      var AboutView = Backbone.View.extend({

        el: '#about-container',

        // Compile our footer template.
        template: Handlebars.compile(aboutTemplate),

        initialize: function () {

          this.render();

        },

        render: function () {

          $(".tab").removeClass("current");
          $("#about-button").addClass("current");

          // Update el with the cached template.
          $(this.el).html(this.template());

          return this;

        }

      });

      return AboutView;

    }
);