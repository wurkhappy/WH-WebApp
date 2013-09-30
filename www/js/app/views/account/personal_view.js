/*
 * Personal Account View.
 */

define(['backbone', 'handlebars', 'text!templates/account/personal.html'],

    function (Backbone, Handlebars, personalTemplate) {

      'use strict';

      var PersonalView = Backbone.View.extend({

        className:'clear',

        attributes:{'id':'content'},

        template: Handlebars.compile(personalTemplate),

        initialize: function () {
          this.render();
        },

        render: function () {
          this.$el.html(this.template());
          return this;
        }

      });

      return PersonalView;

    }
);