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
                        if (!key["dateExpected"] || key["dateExpected"] === "0001-01-01T00:00:00Z") {
                            delete key["dateExpected"];
                            delete this.attributes["dateExpected"];
                        } else {
                            key["dateExpected"] = moment(key["dateExpected"]);
                        }
                    }
                } else if (key === 'amountDue') {
                    value = parseFloat(value);
                } else if (key === 'dateExpected') {
                    if (!value || value === "0001-01-01T00:00:00Z") {
                        key = null;
                        value = null;
                        delete this.attributes["dateExpected"];
                    } else {
                        value = (typeof value === "string") ? moment(value) : value;
                    }
                }

                Backbone.RelationalModel.prototype.set.apply(this, [key, value, options]);
                return this;
            },
            isComplete: function() {
                if (this.get("subTasks").length === 0) return (this.get("lastAction") && this.get("lastAction").get("name") === "completed");
                return this.get("subTasks").getCompleted().length === this.get("subTasks").length;
            },
            isPaid: function() {
                return (this.get("lastAction") && this.get("lastAction").get("name") === "paid");
            },
            isPartiallyPaid: function() {
                return this.get("subTasks").getPaid().length > 0;
            },
            completed: function(data, successCallback) {
                this.updateStatus(_.extend(data, {
                    "name": "completed"
                }), successCallback);
            },
            noAction: function(data, successCallback) {
                this.updateStatus(null, successCallback);
            },
            getCompletedInfo: function() {
                var subTasks = this.get("subTasks").getCompleted();
                return {
                    "completed": this.get("subTasks").getCompleted().length,
                    "total": this.get("subTasks").length
                };
            },
            updateStatus: function(reqData, successCallback) {
                $.ajax({
                    type: "POST",
                    url: "/tasks/" + this.id + "/action",
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(reqData),
                    success: _.bind(function(response) {
                        this.set("lastAction", response);
                        if (_.isFunction(successCallback)) successCallback();
                    }, this)
                });
            },
        });

        return WorkItem;

    }

);