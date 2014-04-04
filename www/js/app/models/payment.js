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
                key: 'lastAction',
                relatedModel: StatusModel,
                collectionType: StatusCollection,
            }],
            urlRoot: function() {
                return "/payments";
            },
            set: function(key, value, options) {
                //amount has to be a float or integer. Backend won't accept number as string.
                if (typeof key === 'object') {
                    if (_.has(key, "amountDue")) {
                        key["amountDue"] = parseFloat(key["amountDue"]);
                    }
                    if (_.has(key, "dateExpected")) {
                        key["dateExpected"] = moment(key["dateExpected"]);
                    }
                } else if (key === 'amountDue') {
                    value = parseFloat(value);
                } else if (key === 'dateExpected') {
                    value = (typeof value === "string") ? moment(value) : value;
                }

                Backbone.RelationalModel.prototype.set.apply(this, [key, value, options]);
                return this;
            },
            submit: function(data, successCallback) {
                this.updateStatus(_.extend(data, {
                    "name": "submitted"
                }), successCallback);

            },
            accept: function(debitSource, paymentType) {
                this.updateStatus({
                    "name": "accepted",
                    "debitSourceID": debitSource,
                    "paymentType": paymentType
                });
            },
            reject: function(message) {
                this.updateStatus({
                    "name": "rejected",
                    "message": message
                });
            },
            updateStatus: function(reqData, successCallback) {
                return;
                $.ajax({
                    type: "POST",
                    url: "/payments/" + this.id + "/action",
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(reqData),
                    success: _.bind(function(response) {
                        this.set("lastAction", response);
                        Backbone.trigger("updateCurrentStatus", this.get("lastAction"))
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
                    var amountDue = value.get("amountDue") || 0;
                    return memo + amountDue
                }, 0);
            },
            getAgreementVersionID: function() {
                return this.collection.getAgreementVersionID();
            },
            isPaid: function() {
                return this.get("amountDue") === this.get("amountPaid") && this.get("amountDue") > 0;
            }
        });

        return Payment;

    }

);