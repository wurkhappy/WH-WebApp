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
            }

        });

        return Collection;

    }

);