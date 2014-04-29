define(['backbone', 'backbone-relational', 'models/status', 'collections/status'],

    function(Backbone, Relational, StatusModel, StatusCollection) {

        'use strict';

        var ScopeItem = Backbone.RelationalModel.extend({
            relations: [{
                type: Backbone.HasOne,
                key: 'lastAction',
                relatedModel: StatusModel,
                collectionType: StatusCollection,
            }],
            getWorkItemID: function() {
                return this.collection.getWorkItemID();
            },
            isPaid: function() {
                return !!this.get("isPaid");
            },
            setAsCompleteForUser: function(userID) {
                this.set("lastAction", {
                    "name": "completed",
                    "userID": userID,
                    "date": moment()
                });
            },
            isComplete: function() {
                return this.get("lastAction") && (this.get("lastAction").get("name") === "completed" || this.get("lastAction").get("name") === "paid");
            }
        });

        return ScopeItem;

    }

);