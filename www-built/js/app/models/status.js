define(["backbone","backbone-relational","moment"],function(e,t,n){var r=e.RelationalModel.extend({StatusCreated:"created",StatusSubmitted:"submitted",StatusAccepted:"accepted",StatusRejected:"rejected",StatusWaiting:"Waiting for Response",set:function(t,r,i){e.RelationalModel.prototype.set.apply(this,arguments),typeof t=="object"?_.has(t,"date")&&(this.attributes.date=n(t.date)):t==="date"&&(this.attributes.date=n(r))},url:function(){return this.get("paymentID")?"/agreement/v/"+this.get("agreementID")+"/payment/"+this.get("paymentID")+"/status":"/agreement/v/"+this.get("agreementID")+"/status"}});return r});