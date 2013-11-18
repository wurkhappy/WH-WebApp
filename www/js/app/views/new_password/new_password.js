/*
 * New Password View.
 *
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
        console.log("init");
        this.userID = options.userID;
        this.user = {id: this.userID};
      },
      updateModel: function(event){
        this.user[event.target.name] = event.target.value;
      },
      submitModel: function(event){
        event.preventDefault();
        event.stopPropagation();            

        $.ajax({
          type: "PUT",
          url: "/user/"+this.userID+"/password",
          contentType: "application/json",
          dataType: "json",
          data:JSON.stringify(this.user),
          success: function(response){
            if (response["redirectURL"]) window.location = response["redirectURL"];
          }
        });
      }
    });

    return NewPasswordView;

  }
  );