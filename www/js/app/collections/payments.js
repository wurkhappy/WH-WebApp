/*
 * Collection.
 */

 define(['backbone', 'models/payment'],

    function(Backbone, Model) {

        'use strict';

        var Collection = Backbone.Collection.extend({

            // Reference to this collection's model.
            model: Model,
            comparator: function(model){
                return (model.get("dateCreated")) ? model.get("dateCreated").valueOf() : 0;
            },

            getTotalAmount:function(){
                return this.reduce(function(memo, value) {
                    return memo + value.get("paymentItems").reduce(function(count, val){
                        return count + val.get("amount");
                    }, 0) 
                }, 0);
            },
            findSubmittedPayment:function(){
                var paymentArray = this.filter(function(model){
                    return model.get("currentStatus") && model.get("currentStatus").get("action") === 'submitted';
                });
                return paymentArray[0];
            },
            findFirstOutstandingPayment:function(){
                var model = this.at(this.length -1);
                    if (model.get("currentStatus") && (model.get("currentStatus").get("action") === 'submitted' || model.get("currentStatus").get("action") === 'rejected')){
                        return model;
                    }
                return null;
            },
            getAcceptedPayments: function() {
                var paymentArray = this.filter(function(model) {

                    if (model.get("currentStatus") !== null) {
                        return model.get("currentStatus").get("action") === 'accepted';
                    } else {
                        return 0;
                    }
                });
                return new Collection(paymentArray, this.modelOptions);
            },
            getPercentComplete: function() {
                var paymentsAccepted = this.getAccepted().length,
                totalPayments = this.length;

                if (paymentsAccepted === 0) {
                    return 0;
                } else {
                    return paymentsAccepted/totalPayments;
                }
            },
            getAgreementVersionID: function(){
                return this.parent.id;
            }

        });

return Collection;

}

);