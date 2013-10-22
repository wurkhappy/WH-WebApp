
define(['backbone', 'handlebars', 'views/agreement/read/header_states/base_state'],

  function (Backbone, Handlebars, BaseState) {

    'use strict';

    var SubmittedState = BaseState.extend({
      initialize:function(){
        BaseState.prototype.initialize.apply(this);
        this.button1Title = (this.userIsClient) ? "Accept " + this.statusType : null; 
        this.button2Title = (this.userIsClient) ? "Reject " + this.statusType : null;
      },
      button1:function(event){
        //we don't check for userIsClient here because if title is null then button doesn't call action
        if (this.statusType === 'payment') {

          $('#overlay').fadeIn('slow');

          this.model.get("payments").findSubmittedPayment().accept();
        }
        else{
          this.model.accept();
        }
      },
      button2:function(event){
        if (this.statusType === 'payment') {
          this.model.get("payments").findSubmittedPayment().reject();
        }
        else{
          this.model.reject();
        }
      }

    });

    return SubmittedState;

  }
  );