/*
 * Recipient Details - Create Agreement View.
 */

define(['backbone', 'handlebars', 'text!templates/create_agreement/recipient.html'],

    function (Backbone, Handlebars, recipientTemplate) {

      'use strict';

      var RecipientDetailsView = Backbone.View.extend({

        el: '#content',

        // Compile our footer template.
        template: Handlebars.compile(recipientTemplate),

        initialize: function () {

          this.render();

        },

        render: function () {

          // Update el with the cached template.
          $(this.el).html(this.template());

          return this;

        }

      });

      return RecipientDetailsView;

    }
);