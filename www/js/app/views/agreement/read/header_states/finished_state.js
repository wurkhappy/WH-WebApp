define(['backbone', 'handlebars', 'toastr', 'views/agreement/read/header_states/base_state'],

    function(Backbone, Handlebars, toastr, BaseState) {

        'use strict';

        var FinishedState = BaseState.extend({
            initialize: function(options) {
                BaseState.prototype.initialize.apply(this, [options]);
                this.button1Title = (this.model.get("archived")) ? null : "Archive Agreement";
                this.button2Title = (this.userIsClient) ? null : "Edit Agreement";
            },
            button1: function(event) {

                toastr.success('Agreement Archived');

                var changeLocation = function() {
                    window.location = "/home";
                };

                _.delay(changeLocation, 500);

                _.defer(this.model.archive());

            },
            button2: function(event) {
                this.edit();
            }

        });

        return FinishedState;

    }
);