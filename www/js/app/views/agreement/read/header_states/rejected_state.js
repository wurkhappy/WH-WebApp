
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
          var payment = this.model.get("payments").findFirstOutstandingPayment();
          var newPayment = new payment.collection.model({
            paymentItems:payment.get("paymentItems"),
            includesDeposit: payment.get("includesDeposit"),
            agreementVersionID: payment.agreementVersionID
          });

          //work around going on here.
          //in order to make the call to the API the model needs to belong to a collection
          //we don't want to trigger the add event because we don't know if the model will be accepted or not
          //if it's not we remove it. if it is we trigger add
          this.model.get("payments").add(newPayment,{silent:true});
          newPayment.submit({}, _.bind(function(){

            if (!newPayment.id) {
              this.model.get("payments").remove(newPayment);
            } else{
              this.model.get("payments").trigger('add');
            }
          },this));

        }
        else{
          this.model.submit()
        }
      },
      button2:function(event){
        window.location.hash = "edit";
      }

    });

return RejectedState;

}
);