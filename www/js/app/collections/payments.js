/*
 * Collection.
 */

define(['backbone', 'models/payment'],

    function(Backbone, Model) {

        'use strict';

        var Collection = Backbone.Collection.extend({

            // Reference to this collection's model.
            model: Model,
            comparator: function(model) {
                return (model.get("number")) ? model.get("number").valueOf() : 0;
            },
            findDeposit: function() {
                var models = this.filter(function(model) {
                    return model.get("isDeposit");
                });
                if (models.length == 0) return null;
                return models[0];
            },
            getTotalDue: function() {
                return this.reduce(function(memo, value) {
                    var amount = (value.get("amountDue")) ? value.get("amountDue") : 0;
                    return memo + amount;
                }, 0);
            },
            getTotalPaid: function() {
                return this.reduce(function(memo, value) {
                    var amount = (value.get("amountPaid")) ? value.get("amountPaid") : 0;
                    return memo + amount;
                }, 0);
            },
            getNonZeroPayments: function() {
                var payments = this.filter(function(model) {
                    return model.get("amountDue") > 0;
                });
                return new Collection(payments);
            },
            findSubmittedPayment: function() {
                var paymentArray = this.filter(function(model) {
                    return model.get("lastAction") && model.get("lastAction").get("name") === 'submitted';
                });
                return paymentArray[0];
            },
            findAllOutstanding: function() {
                var paymentArray = this.filter(function(model) {
                    return !model.get("lastAction") || model.get("lastAction").get("name") === 'rejected';
                });
                return new Collection(paymentArray);
            },
            getAcceptedPayments: function() {
                var paymentArray = this.filter(function(model) {

                    if (model.get("lastAction") !== null) {
                        return model.get("lastAction").get("name") === 'accepted';
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
                    return paymentsAccepted / totalPayments;
                }
            },
            getAgreementVersionID: function() {
                return this.parent.id;
            },
            save: function(data, options) {
                this.each(function(model) {
                    model.set("number", model.collection.indexOf(model));
                });
                $.ajax({
                    type: "POST",
                    url: "/agreements/v/" + this.versionID + "/payments",
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(this.toJSON()),
                    success: _.bind(function(response) {
                        this.set(response);
                        if (_.isFunction(options.success)) options.success();
                    }, this)
                });
            },
            getLastAction: function() {
                var collection = new Collection(this.models);
                collection.comparator = function(model) {
                    return (model.get("lastAction")) ? -model.get("lastAction").get("date").valueOf() : 0;
                }
                collection.sort();
                if (collection.models[0].isDeposit() && collection.models[0].get("lastAction").get("name") === "submitted") {
                    return null;
                }
                return collection.models[0].get("lastAction")
            }

        });

        return Collection;

    }

);