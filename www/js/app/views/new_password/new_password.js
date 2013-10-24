/*
 * Login View.
 */

 define(['backbone', 'handlebars', 'parsley'],

  function (Backbone, Handlebars, parsley) {

    'use strict';

    var NewPasswordView = Backbone.View.extend({

      el:'#reset-pw-wrapper',

      events:{
        "blur input" : "updateModel",
        "click input[type=submit]" : "submitModel",
      },

      initialize: function (options) {
        this.userID = options.userID;
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

    return NewPasswordView;

  }
  );