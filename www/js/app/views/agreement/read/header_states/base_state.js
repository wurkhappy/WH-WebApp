define(['backbone', 'handlebars'],

    function(Backbone, Handlebars) {

        'use strict';

        var BaseState = Backbone.View.extend({
            initialize: function(options) {
                this.userIsClient = this.model.get("clientID") == window.thisUser.id; //thisUser is set by server directly into html
                if (this.model.get("draft")) return;
                this.status = options.status;
                this.statusType = (!this.status.get("type") || this.status.get("type") === "agreement") ? "agreement" : "payment";
                this.userIsStateCreator = this.status.get("userID") == window.thisUser.id;
                this.payments = options.payments;
            },
            button1: function(event) {},
            button2: function(event) {},
            edit: function() {
                window.location.hash = "edit";
            }

        });

        return BaseState;

    }
);