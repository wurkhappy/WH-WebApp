/*
 * Login View.
 */

define(['backbone', 'handlebars', 'parsley', 'hbs!templates/landing/login', 'models/user'],

    function (Backbone, Handlebars, parsley, loginTemplate, UserModel) {

      'use strict';

      var LoginView = Backbone.View.extend({

        // Compile our footer template.
        template: loginTemplate,
        model: new UserModel(),

        events:{
          "blur input" : "updateModel",
          "click input[type=submit]" : "debounceSubmitModel",
          "keypress input": "submitOnEnter"
        },

        initialize: function () {
          this.model.url = "/user/login";
          this.render();
        },

        render: function () {

          // Update el with the cached template.
          $(this.el).html(this.template());

          return this;

        },
        updateModel: function(event){
          this.model.set(event.target.name, event.target.value);
        },

        submitOnEnter: function (event) {
          if (event.keyCode != 13) { 
            return;
            }
          this.updateModel(event);
          this.submitModel(event);
        },

        debounceSubmitModel: function(event) {
          event.preventDefault();
          event.stopPropagation();
          this.submitModel();
        },

        submitModel: _.debounce(function(event){
          this.model.save({}, {
            success:function(model, response){
              if (response["redirectURL"]) window.location = response["redirectURL"];
            },
            error:function(model, response){
              $('#password').addClass('parsley-error');
              $('#email').addClass('parsley-error');
              $('#server_error').html('<ul class="parsley-error-list" style="display: block;"><li class="type" style="display: list-item;">'+response.responseText+'.</li></ul>');

            }
          })       
        }, 500, true)

      });
      return LoginView;
    }
);