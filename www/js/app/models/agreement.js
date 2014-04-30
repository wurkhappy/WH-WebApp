define(['backbone', 'backbone-relational', 'moment', 'models/status', ],

    function(Backbone, Relational, moment, StatusModel) {

        'use strict';

        var Agreement = Backbone.RelationalModel.extend({
            relations: [{
                type: Backbone.HasOne,
                key: 'lastAction',
                relatedModel: StatusModel,
            }, {
                type: Backbone.HasOne,
                key: 'lastSubAction',
                relatedModel: StatusModel,
            }],

            idAttribute: "versionID",
            userID: "",
            initialize: function() {
                this.listenTo(Backbone, "updateCurrentStatus", this.setCurrentStatus);
            },
            set: function(key, value, options) {
                if (typeof key === 'object') {
                    if (_.has(key, "dateCreated")) {
                        key["dateCreated"] = moment(key["dateCreated"]);
                    }
                } else if (key === 'dateCreated') {
                    value = moment(value);
                }
                Backbone.RelationalModel.prototype.set.apply(this, [key, value, options]);
                return this;
            },
            setCurrentStatus: function(model) {
                this.set("lastAction", model);
            },
            urlRoot: function() {
                return "/agreement/v";
            },
            submit: function(message, successCallback) {
                this.updateStatus("submitted", message, successCallback);
            },
            update: function(message, successCallback) {
                this.updateStatus("updated", message, successCallback);
            },
            accept: function(message, successCallback) {
                this.updateStatus("accepted", message, successCallback);
            },
            reject: function(message, successCallback) {
                this.updateStatus("rejected", message, successCallback);
            },
            updateStatus: function(action, message, successCallback) {
                $.ajax({
                    type: "POST",
                    url: "/agreement/v/" + this.id + "/status",
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify({
                        "name": action,
                        "message": message
                    }),
                    success: _.bind(function(response) {
                        this.set("lastAction", response);
                        if (_.isFunction(successCallback)) successCallback();
                    }, this)
                });
            },
            archive: function(userID, successCallback) {
                this.updateStatus("completed", "", successCallback);
            },
            percentComplete: function() {
                var totalComplete = 0;
                this.get("workItems").each(function(model) {
                    if (model.isComplete()) totalComplete += 1;
                });
                return (totalComplete / this.get("workItems").length) * 100;

            }
        });

        return Agreement;

    }

);