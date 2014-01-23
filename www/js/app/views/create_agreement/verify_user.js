define(['backbone', 'handlebars', 'toastr', 'hbs!templates/create_agreement/verify_user', 'spinjs'],

    function(Backbone, Handlebars, toastr, tpl, Spinner) {

        'use strict';

        var VerifyUser = Backbone.View.extend({

            template: tpl,

            events: {
                'blur input[type="text"]': 'updateFields',
                "click #save-button": "debounceSave",
                'blur input[name="phoneNumber"]': "updatePhoneNumber"
            },

            initialize: function() {
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            },
            updateFields: function(event) {
                this.model.set(event.target.name, event.target.value);
            },
            updatePhoneNumber: function(event) {
                var number = event.target.value;
                this.model.set("phoneNumber", number.replace(/[^0-9]/g, ""));
            },

            debounceSave: function(event) {
                event.preventDefault();
                event.stopPropagation();
                this.save();
            },

            save: _.debounce(function(event) {

                $('.account_personal_form').parsley('validate');
                var isValid = this.$('.verify_user_form').parsley('isValid');
                if (isValid) {
                    var opts = {
                        lines: 13, // The number of lines to draw
                        length: 20, // The length of each line
                        width: 10, // The line thickness
                        radius: 30, // The radius of the inner circle
                        corners: 1, // Corner roundness (0..1)
                        rotate: 0, // The rotation offset
                        direction: 1, // 1: clockwise, -1: counterclockwise
                        color: '#000', // #rgb or #rrggbb or array of colors
                        speed: 1, // Rounds per second
                        trail: 60, // Afterglow percentage
                        shadow: false, // Whether to render a shadow
                        hwaccel: false, // Whether to use hardware acceleration
                        className: 'spinner', // The CSS class to assign to the spinner
                        zIndex: 2e9, // The z-index (defaults to 2000000000)
                        top: 'auto', // Top position relative to parent in px
                        left: 'auto' // Left position relative to parent in px
                    };
                    var spinner = new Spinner(opts).spin(this.$el[0]);
                    this.model.save({}, {
                        success: _.bind(function(model, response) {
                            spinner.stop();
                            this.trigger("userVerified");
                            toastr.success('Success!');

                        }, this),
                        error: function() {
                            toastr.error("There was an error. Please double check the information.")
                        }
                    });
                }
            }, 500, true)

        });

        return VerifyUser;

    }
);