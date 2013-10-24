/*
 * Login View.
 */

 define(['backbone', 'handlebars', 'parsley', 'text!templates/landing/forgot_password.html', 'models/user'],

  function (Backbone, Handlebars, parsley, forgotPWTemplate, UserModel) {

    'use strict';

    var ForgotPasswordView = Backbone.View.extend({

        // Compile our footer template.
        template: Handlebars.compile(forgotPWTemplate),

        events:{
          "blur input" : "updateModel",
          "click input[type=submit]" : "submitModel",
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

        submitModel: function(event){
          event.preventDefault();
          event.stopPropagation();            

          $.ajax({
            type: "POST",
            url: "/password/forgot",
            contentType: "application/json",
            dataType: "json",
            data:JSON.stringify(this.user),
            success: _.bind(function(response){
              this.$('form').html("Please check your e-mail to renew your password.");
            }, this)
          });
        }

      });

return ForgotPasswordView;

}
);