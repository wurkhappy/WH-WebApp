
define(['backbone', 'handlebars'],

  function (Backbone, Handlebars) {

    'use strict';

    var BaseState = Backbone.View.extend({
      initialize:function(){
        this.status = this.model.get("currentStatus");
        this.statusType = (this.status.get("paymentID")) ? "payment" : "agreement";
        this.userIsClient = this.model.get("clientID") == window.thisUser.id;//thisUser is set by server directly into html
      },
      button1:function(event){
      },
      button2:function(event){
      },
      edit: function(){
        this.checkVersion();
        window.location.hash = "edit";
      },
      checkVersion: function(){
        if (!this.model.get("draft")) {
          var version  = this.model.get("version");
          this.model.set("version", version + 1);
          this.model.unset("id");
          this.model.set("draft", true);
          console.log(this.model);
        }
      }

    });

    return BaseState;

  }
  );