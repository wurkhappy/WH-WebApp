
define(['backbone', 'handlebars', 'views/agreement/read/header_states/base_state'],

  function (Backbone, Handlebars, BaseState) {

    'use strict';

    var FinishedState = BaseState.extend({
      initialize:function(){
        BaseState.prototype.initialize.apply(this);
        this.button1Title = (this.model.get("archived")) ? null : "Archive Agreement"; 
        this.button2Title = (this.userIsClient) ? null : null; 
      },
      button1:function(event){
        this.model.archive();
      },
      button2:function(event){
      }

    });

    return FinishedState;

  }
  );