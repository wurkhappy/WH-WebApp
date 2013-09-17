/*
 * Scope of Work - Create Agreement View.
 */

define(['backbone', 'handlebars', 'text!templates/create_agreement/scope.html'],

    function (Backbone, Handlebars, scopeTemplate) {

      'use strict';

      var ScopeOfWorkView = Backbone.View.extend({

        el: '#content',

        // Compile our footer template.
        template: Handlebars.compile(scopeTemplate),

        initialize: function () {

          this.render();

        },

        render: function () {

          // Update el with the cached template.
          $(this.el).html(this.template());

          return this;

        }

      });

      return ScopeOfWorkView;

    }
);