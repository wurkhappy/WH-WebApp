/*
 * Create Agreement Main - Create Agreement View.
 */

define(['backbone', 'handlebars', 'text!templates/account/create.html'],

    function (Backbone, Handlebars, createTemplate) {

      'use strict';

      var CreateAgreementView = Backbone.View.extend({

        el: '#content',

        // Compile our footer template.
        template: Handlebars.compile(createTemplate),

        initialize: function () {

          this.render();

        },

        render: function () {

          // Update el with the cached template.
          $(this.el).html(this.template());

          return this;

        }

      });

      return CreateAgreementView;

    }
);