/*
 * Footer View.
 */

define(['backbone', 'handlebars', 'hbs!templates/landing/pricing'],

    function (Backbone, Handlebars, pricingTemplate) {

      'use strict';

      var PricingView = Backbone.View.extend({

        el: '#about-container',

        // Compile our footer template.
        template: pricingTemplate,

        initialize: function () {

          //this.render();

        },

        render: function () {

          $(".tab").removeClass("current");
          $("#pricing-button").addClass("current");

          // Update el with the cached template.
          $(this.el).html(this.template());

          return this;

        }

      });

      return PricingView;

    }
);