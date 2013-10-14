
define(['backbone', 'handlebars', 'views/agreement/read/header_states/base_state'],

  function (Backbone, Handlebars, BaseState) {

    'use strict';

    var EditState = BaseState.extend({
      initialize:function(){
        BaseState.prototype.initialize.apply(this);
        this.button1Title = (this.userIsClient) ? null : "Submit Agreement"; 
        this.button2Title = (this.userIsClient) ? null : "Edit Draft"; 
      },
      button1:function(event){
        this.model.set("draft", false);
        this.model.save({},{success:_.bind(function(model, response){
          var submitSuccess = function(){
            window.location = "/home"
          };
          this.model.submit(submitSuccess);
        },this)});      
      },
      button2:function(event){
        this.model.set("draft", true);
        this.model.save({},{success:function(model, response){
          window.location = "/home";
        }});      
      },

    });

    return EditState;

  }
  );