/*
 * Collection.
 */

define(['backbone', 'underscore', 'models/task', 'collections/scope_items'],

    function(Backbone, _, Model, TasksCollection) {

        'use strict';

        var Collection = Backbone.Collection.extend({

            // Reference to this collection's model.
            model: Model,
            getTotalAmount: function() {
                return this.reduce(function(memo, value) {
                    return memo + value.get("amountDue")
                }, 0);
            },
            findSubmitted: function() {
                var models = this.filter(function(model) {
                    return model.get("currentStatus") && model.get("currentStatus").get("action") === 'submitted';
                });
                return models[0];
            },
            findFirstOutstanding: function() {
                var models = this.filter(function(model) {
                    return model.get("amountDue") > model.get("amountPaid");
                });
                return models[0];
            },
            findAllOutstanding: function() {
                var models = this.filter(function(model) {
                    return model.get("amountDue") > model.get("amountPaid");
                });
                return new Collection(models, this.modelOptions);
            },
            findDeposit: function() {
                var models = this.filter(function(model) {
                    return model.get("required");
                });
                if (models.length == 0) return null;
                return models[0];
            },
            getAccepted: function() {
                var models = this.filter(function(model) {

                    if (model.get("currentStatus") !== null) {
                        return model.get("currentStatus").get("action") === 'accepted';
                    } else {
                        return false;
                    }
                });
                return new Collection(models, this.modelOptions);
            },
            getNumberOfSubmitted: function() {
                var models = this.filter(function(model) {
                    return model.get("currentStatus") && model.get("currentStatus").get("action") === 'submitted';
                });
                return models.length;
            },
            getPercentComplete: function() {
                var numberAccepted = this.getAccepted().length;

                if (numberAccepted === 0) {
                    return 0;
                } else {
                    return (numberAccepted / this.length) * 100;
                }
            },
            getTasks: function() {
                var collection = new TasksCollection();
                this.each(function(model) {
                    collection.add(model.get("scopeItems").models);
                });
                return collection;
            },
            getUnpaid: function() {
                var models = this.filter(function(model) {
                    return !model.get("isPaid");
                });
                return new Collection(models);
            },
            getCompleted: function() {
                var models = this.filter(function(model) {
                    return model.get("completed");
                });
                return new Collection(models);
            },
            getNonPartiallyPaid: function() {
                var models = this.filter(function(model) {
                    return !model.isPartiallyPaid();
                });
                return new Collection(models);
            },
            save: function(data, options) {
                $.ajax({
                    type: "POST",
                    url: "/agreements/v/" + this.versionID + "/tasks",
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(this.toJSON()),
                    success: _.bind(function(response) {
                        this.set(response);
                        if (_.isFunction(options.success)) options.success();
                    }, this)
                });
            }
        });

        return Collection;

    }

);