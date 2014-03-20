/*
 * Payment Layout - Manage regions in the payments section of create agreement
 * 
 */

define(['backbone', 'handlebars', 'underscore', 'marionette',
         'views/create_agreement/payments/payments_preview_view', 
         'views/create_agreement/payments/payment_schedule_view',
         'views/create_agreement/payments/payment_terms_view',  
         'hbs!templates/create_agreement/payment_layout_tpl'
    ],

    function(Backbone, Handlebars, _, Marionette, PaymentPreviewView, PaymentScheduleView, paymentTermsView, payment_layout_tpl) {

        'use strict';

        var Layout = Backbone.Marionette.Layout.extend({
            template: payment_layout_tpl,

            regions: {
                terms: "#paymentTerms",
                schedule: "#paymentSchedule",
                preview: "#paymentPreview"
            },

            initialize: function(options) {
                this.user = options.user;
                this.otherUser = options.otherUser;
            },

            onRender: function() {
                this.showTerms();
                this.showSchedule();
                this.showPreview();
                
            },

            // show regions

            showTerms: function() {
                this.terms.show(new paymentTermsView({
                    user: this.user,
                    collection: this.model.get("payments"),
                    model: this.model,
                    acceptsCreditCard: this.model.get("acceptsCreditCard"),
                    acceptsBankTransfer: this.model.get("acceptsBankTransfer"),
                }));
            },

            showSchedule: function() {
                this.schedule.show(new PaymentScheduleView({
                    model: this.model,
                    user: this.user,
                    collection: this.model.get("payments")
                }));
            },

            showPreview: function() {
                this.preview.show(new PaymentPreviewView({
                    collection: this.model.get("payments")
                }));
            },


            // layout specific events and functionality below

             events: {
                "click #addPayment": "addPayment",
                "click #saveContinue": "debounceSaveAndContinue",
            },

            addPayment: function(event) {
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
                        window.location.hash = 'review';
                    }, this)
                });
            }, 500, true),
            
        });

        return Layout;

    }
);