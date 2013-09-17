/*
 * Personal Signup View.
 */

define(['backbone', 'handlebars', 'text!templates/signup/payment.html'],

    function (Backbone, Handlebars, paymentTemplate) {

      'use strict';

      var PaymentView = Backbone.View.extend({

        el: '#content',

        // Compile our footer template.
        template: Handlebars.compile(paymentTemplate),

        initialize: function () {

          this.render();

        },

        render: function () {

          // Update el with the cached template.
          $(this.el).html(this.template());

          return this;

        }

      });

      return PaymentView;

    }
);