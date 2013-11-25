/*
 * Collection.
 */

define(['backbone', 'models/payment'],

    function(Backbone, Model) {

        'use strict';

        var Collection = Backbone.Collection.extend({

            // Reference to this collection's model.
            model: Model,

            getTotalAmount:function(){
                return this.reduce(function(memo, value) { return memo + value.get("amount") }, 0);
            },
            findSubmittedPayment:function(){
                var paymentArray = this.filter(function(model){
                    return model.get("currentStatus") && model.get("currentStatus").get("action") === 'submitted';
                });
                return paymentArray[0];
            },
            findFirstOutstandingPayment:function(){
                var paymentArray = this.filter(function(model){
                    return !model.get("currentStatus") || model.get("currentStatus").get("action") !== 'accepted';
                });
                return paymentArray[0];
            },
            findAllOutstandingPayment:function(){
                var paymentArray = this.filter(function(model){
                    return !model.get("currentStatus") || model.get("currentStatus").get("action") !== 'accepted';
                });
                return new Collection(paymentArray);
            },
            findFirstRequiredPayment:function(){
                var paymentArray = this.filter(function(model){
                    return model.get("required");
                });
                if (paymentArray.length == 0) return null;
                return paymentArray[0];
            },
            getTotalPayments: function() {
                return this.length;
            },
            getAcceptedPayments: function() {
                var paymentArray = this.filter(function(model) {

                    if (model.get("currentStatus") !== null) {
                        return model.get("currentStatus").get("action") === 'accepted';
                    } else {
                        return 0;
                    }
                });
                return paymentArray.length;
            },

            getNumberOfSubmittedPayments: function () {
                var paymentArray = this.filter(function(model){
                    return model.get("currentStatus") && model.get("currentStatus").get("action") === 'submitted';
                });
                return paymentArray.length;
            },
            getPercentComplete: function() {
                var paymentsAccepted = this.getAcceptedPayments(),
                    totalPayments = this.getTotalPayments();

                if (paymentsAccepted === 0) {
                    return 0;
                } else {
                    return paymentsAccepted/totalPayments;
                }
            }

        });

        return Collection;

    }

);