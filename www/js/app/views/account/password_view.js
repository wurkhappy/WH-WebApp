/*
 * Password Account View.
 */

define(['backbone', 'handlebars', 'text!templates/account/password.html'],

    function (Backbone, Handlebars, passwordTemplate) {

      'use strict';

      var PasswordView = Backbone.View.extend({

        className:'clear white_background',

        attributes:{'id':'content'},

        template: Handlebars.compile(passwordTemplate),

        events: {
          "click #submit-button":"save",
          "blur input" : "updatePassword"
        },

        initialize: function () {
          this.render();
          this.passwords = {};
        },

        render: function () {
          this.$el.html(this.template());
          return this;
        },
        save:function(event){
          if (this.passwords["new-pw"] === this.passwords["confirm-new-pw"]) {
            this.model.set("newPassword", this.passwords["new-pw"]);
            this.model.set("currentPassword", this.passwords["current-pw"]);
            this.model.save({},{success:_.bind(function(model, response){
              this.$('input').val('');
              $(".notification_container").fadeIn("slow");
            },this)});
          }
        },
        updatePassword: function(event){
          this.passwords[event.target.name] = event.target.value
          $(".notification_container").fadeOut('fast').fadeOut("slow");
        }

      });
      
      return PasswordView;
    }
);