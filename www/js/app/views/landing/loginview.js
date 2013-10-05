/*
 * Login View.
 */

define(['backbone', 'handlebars', 'parsley', 'text!templates/landing/login.html', 'models/user'],

    function (Backbone, Handlebars, parsley, loginTemplate, UserModel) {

      'use strict';

      var LoginView = Backbone.View.extend({

        // Compile our footer template.
        template: Handlebars.compile(loginTemplate),
        model: new UserModel(),

        events:{
          "blur input" : "updateModel",
          "click input[type=submit]" : "submitModel"
        },

        initialize: function () {
          this.model.url = "/user/login";

        },

        render: function () {

          // Update el with the cached template.
          $(this.el).html(this.template());

          return this;

        },
        updateModel: function(event){
          this.model.set(event.target.name, event.target.value);
        },
        submitModel: function(event){
          event.preventDefault();
          event.stopPropagation();
          this.model.save({}, {
            success:function(model, response){
              if (response["redirectURL"]) window.location = response["redirectURL"];
            },
            error:function(model, response){

            }
          })
        }

      });

      return LoginView;

    }
);