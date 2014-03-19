/*
 * Service Layout - Manage regions in the services section of create agreement
 * 
 */

define(['backbone', 'handlebars', 'underscore', 'marionette',
         'views/create_agreement/services_preview_view', 
         'views/create_agreement/services_view', 
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
            },

            onRender: function() {
                this.showServices();
                this.showPreview();
            },

            showServices: function() {
                this.services.show(new ServicesView({
                    model: this.model,
                    user: this.user,
                    collection: this.model.get("workItems"),
                    acceptsCreditCard: this.model.get("acceptsCreditCard"),
                    acceptsBankTransfer: this.model.get("acceptsBankTransfer")
                }));
            },

            showPreview: function() {
                this.servicesPreview.show(new ServicesPreviewView({
                    collection: this.model.get("workItems")
                }));
            },


            // layout specific events and functionality below

             events: {
                "click #addService": "addService",
                "click #saveContinue": "debounceSaveAndContinue",
            },

            addService: function(event) {
                event.preventDefault();
                this.collection.add({});
            },

            debounceSaveAndContinue: function(event) {
                event.preventDefault();
                event.stopPropagation();
                _.clone(this.collection).each(_.bind(function(model) {
                    if (!model.get("title")) {
                        this.collection.remove(model);
                    };
                }, this));
                this.saveAndContinue();
            },

            saveAndContinue: _.debounce(function(event) {

                this.model.save({}, {
                    success: _.bind(function(model, response) {
                        window.location.hash = 'payment';
                    }, this)
                });
            }, 500, true),
            
        });

        return Layout;

    }
);