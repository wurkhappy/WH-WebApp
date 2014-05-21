/*
 * Sample Home - Agreement View.
 */

define(['backbone', 'handlebars', 'underscore',
        'hbs!templates/sample_home/agreement_tpl'
    ],

    function(Backbone, Handlebars, _, agreementTpl) {

        'use strict';

        var AgreementView = Backbone.View.extend({

            tagName: 'tr',
            template: agreementTpl,

            initialize: function(options) {
                this.currentUser = options.currentUser;
                this.userIsClient = this.model.get("clientID") === this.currentUser.id;
                var otherUserID = (this.userIsClient) ? this.model.get("freelancerID") : this.model.get("clientID");
                this.otherUser = options.otherUsers.get(otherUserID);
                //this.tasks = options.tasks[this.model.id];
            },

            render: function() {
                var status = this.model.get("lastAction");

                var otherUser = (this.otherUser) ? this.otherUser.toJSON() : null;
                var statusInfo = this.createStatusInfo();
                this.$el.html(this.template({
                    model: this.model.toJSON(),
                    statusInfo: statusInfo,
                    client: this.userIsClient,
                    otherUser: otherUser,
                    //percentComplete: this.tasks.getPercentComplete()
                    percentComplete: 33
                }));
                return this;
            },

            events: {
                "click #sampleAgreement": "trackSample"

            },

            trackSample: function(event) {
                analytics.track('Clicked Sample Agreement');

            },
            createStatusInfo: function() {
                if (this.model.get("lastAction") && this.model.get("lastAction").get("name") === "created") {
                    return {
                        lastAction: "Draft Saved",
                        currentState: "Waiting to be submitted"
                    };
                }
                var currentState;
                var status = this.model.get("lastAction");
                var paymentStatus = this.model.get("lastSubAction");
                if (paymentStatus && paymentStatus.get("date").valueOf() > status.get("date").valueOf()) {
                    status = paymentStatus;
                }
                var prefix = (status && status.get("type") === "payment") ? "Payment" : "Agreement";
                var lastAction = prefix + " " + status.get("name") + " on " + status.get("date").format('MMM D, YYYY');
                switch (status.get("name")) {
                    case status.StatusSubmitted:
                        currentState = "Waiting for " + prefix;
                        break;
                    case status.StatusCreated:
                        currentState = null;
                        lastAction = null;
                        break;
                    default:
                        currentState = "Waiting for Current Milestone";
                        if (this.percentComplete == 100) {
                            currentState = "Agreement Completed";
                        }
                }

                return {
                    lastAction: lastAction,
                    currentState: currentState
                };
            }
        });

        return AgreementView;

    }
);