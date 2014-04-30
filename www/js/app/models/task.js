define(['backbone', 'backbone-relational', 'models/scope_item', 'collections/scope_items', 'models/status',
        'collections/status', 'moment'
    ],

    function(Backbone, Relational, ScopeItemModel, ScopeItemCollection, StatusModel, StatusCollection, moment) {

        'use strict';

        var WorkItem = Backbone.RelationalModel.extend({
            relations: [{
                type: Backbone.HasMany,
                key: 'subTasks',
                relatedModel: ScopeItemModel,
                collectionType: ScopeItemCollection,
                reverseRelation: {
                    key: 'parent',
                    includeInJSON: false
                }
            }, {
                type: Backbone.HasOne,
                key: 'lastAction',
                relatedModel: StatusModel,
                collectionType: StatusCollection,
            }],
            urlRoot: function() {
                return "/tasks";
            },
            set: function(key, value, options) {
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
            isComplete: function() {
                if (this.get("subTasks").length === 0) return (this.get("lastAction") && this.get("lastAction").get("name") === "completed");
                return this.get("subTasks").getCompleted().length === this.get("subTasks").length;
            },
            isPaid: function() {
                return this.get("isPaid");
            },
            isPartiallyPaid: function() {
                return this.get("subTasks").getPaid().length > 0;
            }
        });

        return WorkItem;

    }

);