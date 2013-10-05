
define(['backbone', 'handlebars', 'views/agreement/read/header_states/base_state'],

  function (Backbone, Handlebars, BaseState) {

    'use strict';

    var AcceptedState = BaseState.extend({
      initialize:function(){
        BaseState.prototype.initialize.apply(this);
        this.button1Title = (this.userIsClient) ? null : "Request Payment"; 
        this.button2Title = (this.userIsClient) ? null : "Edit Agreement"; 
      },
      button1:function(event){
          this.model.get("payments").findFirstOutstandingPayment().submit();
      },
      button2:function(event){
        this.edit()
      }

    });

    return AcceptedState;

  }
  );