define(['backbone', 'backbone-relational', 'underscore', 'models/payment_item', 'collections/payment_items', 'models/status', 'collections/status'],

    function(Backbone, Relational, _, PaymentItemModel, PaymentItemCollection, StatusModel, StatusCollection) {

        'use strict';

        var Payment = Backbone.RelationalModel.extend({
            relations: [{
                type: Backbone.HasMany,
                key: 'paymentItems',
                relatedModel: PaymentItemModel,
                collectionType: PaymentItemCollection,
            }, {
                type: Backbone.HasOne,
                key: 'currentStatus',
                relatedModel: StatusModel,
                collectionType: StatusCollection,
            }],
            set: function(key, value, options) {
                Backbone.RelationalModel.prototype.set.apply(this, arguments);

                //amount has to be a float or integer. Backend won't accept number as string.
                if (typeof key === 'object') {
                    if (_.has(key, "amount")) {
                        this.attributes.amount = parseFloat(key["amount"]);
                    }
                    if (_.has(key, "dateExpected")) {
                        this.attributes.dateExpected = moment(key["dateExpected"]);
                    }
                } else if (key === 'amount') {
                    this.attributes.amount = parseFloat(value);
                } else if (key === 'dateExpected') {
                    this.attributes.dateExpected = (typeof value === "string") ? moment(value) : value;
                }
                return this;
            },
            submit: function(data, successCallback) {
                $.ajax({
                    type: "POST",
                    url: "/agreement/v/" + this.getAgreementVersionID() + "/payment/",
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(_.extend(this.toJSON(), data)),
                    success: _.bind(function(response) {
                        this.set(response);
                        Backbone.trigger("updateCurrentStatus", this.get("currentStatus"))
                        if (_.isFunction(successCallback)) successCallback();
                    }, this)
                });

            },
            accept: function(debitSource, paymentType) {
                this.updateStatus({
                    "action": "accepted",
                    "debitSourceID": debitSource,
                    "paymentType": paymentType
                });
            },
            reject: function(message) {
                this.updateStatus({
                    "action": "rejected",
                    "message": message
                });
            },
            updateStatus: function(reqData, successCallback) {
                $.ajax({
                    type: "PUT",
                    url: "/agreement/v/" + this.getAgreementVersionID() + "/payment/" + this.id + "/status",
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(reqData),
                    success: _.bind(function(response) {
                        this.set("currentStatus", response);
                        Backbone.trigger("updateCurrentStatus", this.get("currentStatus"))
                        if (_.isFunction(successCallback)) successCallback();
                    }, this)
                });
            },
            isDeposit: function() {
                if (this.get("title") === "Deposit") {
                    return true
                }
            },
            getTotalAmount: function() {
                return this.get("paymentItems").reduce(function(memo, value) {
                    return memo + value.get("amount")
                }, 0);
            },
            getAgreementVersionID: function() {
                return this.collection.getAgreementVersionID();
            }
        });

        return Payment;

    }

);