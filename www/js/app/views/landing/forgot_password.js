/*
 * Login View.
 */

 define(['backbone', 'handlebars', 'parsley', 'hbs!templates/landing/forgot_password', 'models/user'],

  function (Backbone, Handlebars, parsley, forgotPWTemplate, UserModel) {

    'use strict';

    var ForgotPasswordView = Backbone.View.extend({

        // Compile our footer template.
        template: forgotPWTemplate,

        events:{
          "blur input" : "updateModel",
          "click input[type=submit]" : "debounceSubmitModel",
          "keypress input": "submitOnEnter"
        },

        initialize: function () {
          this.render();
          this.user = {};
        },

        render: function () {

          // Update el with the cached template.
          $(this.el).html(this.template());

          return this;

        },
        updateModel: function(event){
          this.user[event.target.name] = event.target.value;
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
          $.ajax({
            type: "POST",
            url: "/password/forgot",
            contentType: "application/json",
            dataType: "json",
            data:JSON.stringify(this.user),
            success: _.bind(function(response){
              this.$('form').html("Please check your email to reset your password.");
            }, this)
          }).fail( function(response){
            $('#target').addClass('parsley-error');
            $('#server_error').html('<ul class="parsley-error-list" style="display: block;"><li class="type" style="display: list-item;">'+response.responseText+'</li></ul>');
          })
        }, 500, true)

      });

return ForgotPasswordView;

}
);