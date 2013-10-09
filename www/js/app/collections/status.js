/*
 * Collection.
 */

 define(['backbone', 'models/status'],

    function(Backbone, Model) {

        'use strict';

        var Collection = Backbone.Collection.extend({

            model: Model,
            comparator:function(item){
            	return -item.get("date").valueOf();
            },
            filterByPaymentID:function(paymentID){
                var filtered = this.filter(function(model){
                    return model.get("paymentID") == paymentID;
                });
                return new Collection(filtered);
            }

        });

        return Collection;

    }

    );