/*
 * Personal Account View.
 */

define(['backbone', 'handlebars', 'text!templates/signup/personal.html'],

    function (Backbone, Handlebars, personalTemplate) {

      'use strict';

      var PersonalView = Backbone.View.extend({

        className:'clear',

        attributes:{'id':'content'},

        template: Handlebars.compile(personalTemplate),

        initialize: function (options) {
          this.router = options.router;
          this.render();
        },

        render: function () {
          this.$el.html(this.template());
          return this;
        },

        events: {
          "click .single" : "saveAndContinue"
        },

        saveAndContinue: function (event) {
          event.preventDefault();
          event.stopPropagation();

          var navigatePage = event.target.getAttribute("href");

          this.router.navigate(navigatePage, {trigger:true});
        }

      });

      return PersonalView;

    }
);