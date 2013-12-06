
define(['backbone', 'handlebars', 'toastr' 'views/agreement/read/header_states/base_state'],

  function (Backbone, Handlebars, toastr, BaseState) {

    'use strict';

    var DraftState = BaseState.extend({
      initialize:function(){
        BaseState.prototype.initialize.apply(this);
        this.button1Title = (this.userIsClient) ? null : "Send Agreement"; 
        this.button2Title = (this.userIsClient) ? null : "Edit Draft"; 
      },
      button1:function(event){
        this.model.set("draft", false);
        this.model.save({},{success:_.bind(function(model, response){

          toastr.success('Draft Saved');

          var submitSuccess = function(){
            window.location = "/home"
          };
          this.model.submit(submitSuccess);
        },this)});      
      },
      button2:function(event){
        window.location.hash = "edit";     
      }

    });

    return DraftState;

  }
  );