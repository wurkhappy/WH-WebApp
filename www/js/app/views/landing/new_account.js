/*
 * Login View.
 */

define(['backbone', 'handlebars', 'parsley', 'text!templates/landing/new_account.html', 'models/user'],

    function (Backbone, Handlebars, parsley, newAccountTemplate, UserModel) {

      'use strict';

      var NewAccountView = Backbone.View.extend({

        // Compile our footer template.
        template: Handlebars.compile(newAccountTemplate),
        model: new UserModel(),

        events:{
          "blur input" : "updateModel",
          "click input[type=submit]" : "submitModel",
          "keypress input": "submitOnEnter"
        },

        initialize: function () {
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

      return NewAccountView;

    }
);