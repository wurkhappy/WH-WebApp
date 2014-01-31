define(['backbone', 'backbone-relational', 'models/scope_item', 'collections/scope_items', 'models/status', 'collections/status'],

    function(Backbone, Relational, ScopeItemModel, ScopeItemCollection, StatusModel, StatusCollection) {

        'use strict';

        var WorkItem = Backbone.RelationalModel.extend({
            relations: [{
                type: Backbone.HasMany,
                key: 'scopeItems',
                relatedModel: ScopeItemModel,
                collectionType: ScopeItemCollection,
                reverseRelation: {
                    key: 'parent',
                    includeInJSON: false
                }
            }, {
                type: Backbone.HasOne,
                key: 'currentStatus',
                relatedModel: StatusModel,
                collectionType: StatusCollection,
            }],
            urlRoot: function() {
                return "/agreement/v/" + this.getAgreementVersionID() + "/work_item";
            },
            set: function(key, value, options) {
                Backbone.RelationalModel.prototype.set.apply(this, arguments);
                //amount has to be a float or integer. Backend won't accept number as string.
                if (typeof key === 'object') {
                    if (_.has(key, "amountDue")) {
                        this.attributes.amountDue = parseFloat(key["amountDue"]);
                    }
                    if (_.has(key, "dateExpected")) {
                        this.attributes.dateExpected = moment(key["dateExpected"]);
                    }
                } else if (key === 'amountDue') {
                    this.attributes.amountDue = parseFloat(value);
                } else if (key === 'dateExpected') {
                    this.attributes.dateExpected = (typeof value === "string") ? moment(value) : value;
                }
                return this;
            },
            isDeposit: function() {
                return this.get("title") === "Deposit";
            },
            getAgreementVersionID: function() {
                return this.collection.parent.id;
            },
            getAgreementID: function() {
                return this.collection.parent.get("agreementID")
            }
        });

        return WorkItem;

    }

);