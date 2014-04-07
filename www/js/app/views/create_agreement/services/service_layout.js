/*
 * Service Layout - Manage regions in the services section of create agreement
 *
 */

define(['backbone', 'handlebars', 'underscore', 'marionette',
        'views/create_agreement/services/services_preview_view',
        'views/create_agreement/services/services_view',
        'hbs!templates/create_agreement/service_layout_tpl'
    ],

    function(Backbone, Handlebars, _, Marionette, ServicesPreviewView, ServicesView, service_layout_tpl) {

        'use strict';

        var Layout = Backbone.Marionette.Layout.extend({
            template: service_layout_tpl,

            regions: {
                services: "#services",
                servicesPreview: "#servicesPreview",
            },

            initialize: function(options) {
                this.user = options.user;
                this.otherUser = options.otherUser;
                this.tasks = options.tasks;
                this.agreement = options.agreement;
            },

            onRender: function() {
                this.showServices();
                this.showPreview();
            },

            // show regions
            showServices: function() {
                this.services.show(new ServicesView({
                    agreement: this.agreement,
                    user: this.user,
                    tasks: this.tasks,
                    acceptsCreditCard: this.agreement.get("acceptsCreditCard"),
                    acceptsBankTransfer: this.agreement.get("acceptsBankTransfer")
                }));
            },
            showPreview: function() {
                this.servicesPreview.show(new ServicesPreviewView({
                    collection: this.tasks
                }));
            },


            // layout specific events and functionality below
            events: {
                "click #addService": "addService",
                "click #saveContinue": "debounceSaveAndContinue",
            },
            addService: function(event) {
                event.preventDefault();
                this.tasks.add({});
            },
            debounceSaveAndContinue: function(event) {
                event.preventDefault();
                event.stopPropagation();
                _.clone(this.tasks).each(_.bind(function(model) {
                    if (!model.get("title")) {
                        this.tasks.remove(model);
                    };
                }, this));
                this.saveAndContinue();
            },
            saveAndContinue: _.debounce(function(event) {

                this.tasks.save({}, {
                    success: _.bind(function(model, response) {
                        window.location.hash = 'payment';
                    }, this)
                });
            }, 500, true),

        });

        return Layout;

    }
);