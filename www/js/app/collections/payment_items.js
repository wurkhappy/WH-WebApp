/*
 * Collection.
 */

define(['backbone', 'models/payment_item'],

    function(Backbone, Model) {

        'use strict';

        var Collection = Backbone.Collection.extend({

            // Reference to this collection's model.
            model: Model,
            getTotalAmountDue: function() {
                return this.reduce(function(memo, value) {
                    var amount = (value.get("amountDue")) ? value.get("amountDue") : 0;
                    return memo + amount;
                }, 0);
            }

        });

        return Collection;

    }

);