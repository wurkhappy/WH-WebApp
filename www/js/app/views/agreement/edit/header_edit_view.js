define(['backbone', 'handlebars', 'underscore', 'toastr', 'hbs!templates/agreement/edit/header_edit_tpl'],

    function(Backbone, Handlebars, _, toastr, userTemplate) {

        'use strict';

        var HeaderView = Backbone.View.extend({
            template: userTemplate,
            initialize: function(options) {
                this.tasks = options.tasks;
                this.payments = options.payments;
            },
            render: function() {
                this.$el.html(this.template({
                    model: this.model.toJSON(),
                    button1Title: "Save",
                    button2Title: "Cancel",
                }));

                return this;
            },
            events: {
                "click #action-button1": "debounceSave",
                "click #action-button2": "cancelAgreement",
            },

            debounceSave: function(event) {
                event.preventDefault();
                event.stopPropagation();
                var that = this;
                _.debounce(function(event) {
                    if (!that.model.get("draft")) {
                        that.model.unset("versionID");
                    }
                    that.model.save({}, {
                        success: function(model, response) {
                            that.model.update("", function() {
                                that.tasks.versionID = that.model.id;
                                that.tasks.save();
                                that.payments.versionID = that.model.id;
                                that.payments.save({}, {
                                    success: function() {
                                        window.location = '/agreement/v/' + model.id;
                                    }
                                });
                                toastr.success("Agreement saved")
                            })
                        }
                    });
                }, 500, true)();
            },
            cancelAgreement: function() {
                event.preventDefault();
                event.stopPropagation();
                window.location = '';
            }

        });

        return HeaderView;

    }
);