define(['backbone', 'backbone-relational'],

    function(Backbone, Relational) {

        'use strict';

        var PaymentItem = Backbone.RelationalModel.extend({
            set: function(key, value, options) {
                //amount has to be a float or integer. Backend won't accept number as string.
                if (typeof key === 'object') {
                    if (_.has(key, "amountDue")) {
                        key["amountDue"] = parseFloat(key["amountDue"]);
                    }
                    if (_.has(key, "hours")) {
                        key["hours"] = parseFloat(key["hours"]);
                    }
                    if (_.has(key, "rate")) {
                        key["rate"] = parseFloat(key["rate"]);
                    }

                } else if (key === 'amountDue') {
                    value = parseFloat(value);
                } else if (key === 'hours') {
                    value = parseFloat(value);
                } else if (key === 'rate') {
                    value = parseFloat(value);
                }
                Backbone.RelationalModel.prototype.set.apply(this, [key, value, options]);
                return this;
            },
        });

        return PaymentItem;

    }

);