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
                return (model.get("dateCreated")) ? model.get("dateCreated").valueOf() : 0;
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
                    return model.get("currentStatus") && model.get("currentStatus").get("action") === 'submitted';
                });
                return paymentArray[0];
            },
            findFirstOutstandingPayment: function() {
                var model = this.at(this.length - 1);
                if (model.get("currentStatus") && (model.get("currentStatus").get("action") === 'submitted' || model.get("currentStatus").get("action") === 'rejected')) {
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
                    return paymentsAccepted / totalPayments;
                }
            },
            getAgreementVersionID: function() {
                return this.parent.id;
            }

        });

        return Collection;

    }

);