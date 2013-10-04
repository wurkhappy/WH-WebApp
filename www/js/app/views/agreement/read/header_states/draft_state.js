
define(['backbone', 'handlebars', 'views/agreement/read/header_states/base_state'],

  function (Backbone, Handlebars, BaseState) {

    'use strict';

    var DraftState = BaseState.extend({
      initialize:function(){
        BaseState.prototype.initialize.apply(this);
        this.button1Title = (this.userIsClient) ? null : "Submit Agreement"; 
        this.button2Title = (this.userIsClient) ? null : "Save Draft"; 
      },
      button1:function(event){
      },
      button2:function(event){
        this.model.save();
      }

    });

    return DraftState;

  }
  );