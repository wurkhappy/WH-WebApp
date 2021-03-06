define(['backbone', 'backbone-relational', 'moment'],

    function(Backbone, Relational, moment) {

        'use strict';

        var Status = Backbone.RelationalModel.extend({
            StatusCreated: "created",
            StatusSubmitted: "submitted",
            StatusAccepted: "accepted",
            StatusRejected: "rejected",
            StatusUpdated: "updated",
            StatusWaiting: "Waiting for Response",
            StatusCancelled: "cancelled",

            set: function(key, value, options) {
                Backbone.RelationalModel.prototype.set.apply(this, arguments);

                if (typeof key === 'object') {
                    if (_.has(key, "date")) {
                        this.attributes.date = moment(key["date"]);
                    }
                } else if (key === 'date') {
                    this.attributes.date = moment(value);
                }
                return this;
            },

        });

        return Status;

    }

);