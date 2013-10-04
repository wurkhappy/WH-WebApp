
define(['backbone', 'handlebars', 'views/agreement/read/header_states/base_state'],

  function (Backbone, Handlebars, BaseState) {

    'use strict';

    var RejectedState = BaseState.extend({
      initialize:function(){
        BaseState.prototype.initialize.apply(this);
        var submitTitle = (this.statusType === 'payment') ? "Request" : "Submit";
        this.button1Title = (this.userIsClient) ? null : submitTitle + " " + this.statusType; 
        this.button2Title = (this.userIsClient) ? null : "Edit Agreement"; 
      },
      button1:function(event){
        //we don't check for userIsClient here because if title is null then button doesn't call action
        if (this.statusType === 'payment') {
          //find payment that has a current status of submitted and submit that one
        }
        else{
          this.edit()
        }
      },
      button2:function(event){
        window.location.hash = "edit";
      }

    });

    return RejectedState;

  }
  );