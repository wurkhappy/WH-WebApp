/*
 * Layout View - Main view container for Create Agreement
 */

define(['backbone', 'handlebars', 'underscore', 'marionette',
        'views/create_agreement/header_cancel', 'views/create_agreement/header_review',
        'views/create_agreement/overview_view', 'views/create_agreement/progress_bar_view',
        'views/create_agreement/review_view', 
        'views/create_agreement/services/service_layout', 'views/create_agreement/payments/payment_layout'
    ],

    function(Backbone, Handlebars, _, Marionette, HeaderCancel, HeaderReview, 
             OverviewView, ProgressBar, ReviewView, ServiceLayout,
             PaymentLayout
            ) {

        'use strict';

        var Layout = Backbone.Marionette.Layout.extend({
            el: '#mainContainer',

            regions: {
                header: "#header-section",
                progress: "#progress-section",
                main: "#main-section",
            },

            initialize: function(options) {
                this.user = options.user;
                this.otherUser = options.otherUser;
            },
            switchToOverview: function() {
                this.header.show(new HeaderCancel({
                    model: this.model
                }));
                this.progress.show(new ProgressBar({
                    title: "Agreement Overview",
                    value: 0
                }));
                this.main.show(new OverviewView({
                    model: this.model,
                    userID: this.user.id
                }));
            },
            switchToServices: function() {
                this.header.show(new HeaderCancel({
                    model: this.model
                }));
                this.progress.show(new ProgressBar({
                    title: "Agreement Services",
                    value: 1
                }));

                this.main.show(new ServiceLayout({
                    model: this.model,
                    user: this.user,
                    collection: this.model.get("workItems"),
                    acceptsCreditCard: this.model.get("acceptsCreditCard"),
                    acceptsBankTransfer: this.model.get("acceptsBankTransfer")
                }));
                
            },

            switchToPayment: function() {
                this.header.show(new HeaderCancel({
                    model: this.model
                }));
                this.progress.show(new ProgressBar({
                    title: "Agreement Payments",
                    value: 2
                }));
                this.main.show(new PaymentLayout({
                    model: this.model,
                    collection: this.model.get("payments"),
                    user: this.user,
                    otherUser: this.otherUser
                }));
            },

            switchToReview: function() {
                this.header.show(new HeaderCancel({
                    model: this.model
                }));
                this.progress.show(new ProgressBar({
                    title: "Agreement Review",
                    value: 3
                }));
                this.main.show(new ReviewView({
                    model: this.model,
                    user: this.user,
                    otherUser: this.otherUser
                }));
            },
            /*switchToEdit: function() {
                this.header.show(new HeaderCancel({
                    model: this.model
                }));
                this.progress.show(new ProgressBar({
                    title: "Send Agreement",
                    value: 3
                }));
                this.main.show(new EditView({
                    model: this.model
                }));
            },*/
            
        });

        return Layout;

    }
);