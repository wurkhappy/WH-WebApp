/*
 * Login View.
 */

define(['backbone', 'handlebars', 'hbs!templates/landing/check_email', 'models/user'],

    function (Backbone, Handlebars, checkEmailTemplate, UserModel) {

      'use strict';

      var CheckEmailView = Backbone.View.extend({

        // Compile our footer template.
        template: checkEmailTemplate,
        //model: new UserModel(),

        initialize: function () {
          //this.model.url = "/user/check-email";
          this.render();
        },

        render: function () {
          // Update el with the cached template.
          $(this.el).html(this.template());
          return this;
        },
      });

      return CheckEmailView;

    }
);