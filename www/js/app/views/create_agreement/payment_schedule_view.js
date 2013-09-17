/*
 * Payment Schedule - Create Agreement View.
 */

define(['backbone', 'handlebars', 'text!templates/create_agreement/schedule.html'],

    function (Backbone, Handlebars, scheduleTemplate) {

      'use strict';

      var PaymentScheduleView = Backbone.View.extend({

        el: '#content',

        // Compile our footer template.
        template: Handlebars.compile(scheduleTemplate),

        initialize: function () {

          this.render();

        },

        render: function () {

          // Update el with the cached template.
          $(this.el).html(this.template());

          return this;

        }

      });

      return PaymentScheduleView;

    }
);