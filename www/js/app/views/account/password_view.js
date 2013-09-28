/*
 * Password Account View.
 */

define(['backbone', 'handlebars', 'text!templates/account/password.html'],

    function (Backbone, Handlebars, passwordTemplate) {

      'use strict';

      var PasswordView = Backbone.View.extend({

        className:'clear',

        attributes:{'id':'content'},

        template: Handlebars.compile(passwordTemplate),

        initialize: function () {
          this.render();
        },

        render: function () {
          this.$el.html(this.template());
          return this;
        }

      });
      
      return PasswordView;
    }
);