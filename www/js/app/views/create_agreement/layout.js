/*
 * Layout View - Main view container for Create Agreement
 */

define(['backbone', 'handlebars', 'underscore', 'marionette',
        'views/create_agreement/header_cancel', 'views/create_agreement/header_review',
        'views/create_agreement/overview_view', 'views/create_agreement/progress_bar_view',
        'views/create_agreement/review_view', 'views/create_agreement/send_view', 'views/create_agreement/services/service_layout',
        'views/create_agreement/payments/payment_layout'
    ],

    function(Backbone, Handlebars, _, Marionette, HeaderCancel, HeaderReview,
        OverviewView, ProgressBar, ReviewView, SendView, ServiceLayout,
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
                this.agreement = options.agreement;
                this.payments = options.payments;
                this.tasks = options.tasks;
                this.otherUser = options.otherUser;
            },
            switchToOverview: function() {
                this.header.show(new HeaderCancel({
                    model: this.agreement
                }));
                this.progress.show(new ProgressBar({
                    title: "Agreement Overview",
                    value: 0
                }));
                this.main.show(new OverviewView({
                    model: this.agreement,
                    userID: this.user.id
                }));
            },
            switchToServices: function() {
                this.header.show(new HeaderCancel({
                    model: this.agreement
                }));
                this.progress.show(new ProgressBar({
                    title: "Agreement Services",
                    value: 1
                }));

                this.main.show(new ServiceLayout({
                    agreement: this.agreement,
                    user: this.user,
                    tasks: this.tasks,
                    acceptsCreditCard: this.agreement.get("acceptsCreditCard"),
                    acceptsBankTransfer: this.agreement.get("acceptsBankTransfer")
                }));

            },
            switchToPayment: function() {
                this.header.show(new HeaderCancel({
                    model: this.agreement
                }));
                this.progress.show(new ProgressBar({
                    title: "Agreement Payments",
                    value: 2
                }));
                this.main.show(new PaymentLayout({
                    agreement: this.agreement,
                    payments: this.payments,
                    user: this.user,
                    otherUser: this.otherUser
                }));
            },

            switchToReview: function() {
                this.header.show(new HeaderCancel({
                    model: this.agreement
                }));
                this.progress.show(new ProgressBar({
                    title: "Agreement Review",
                    value: 3
                }));
                this.main.show(new ReviewView({
                    model: this.agreement,
                    payments: this.payments,
                    tasks: this.tasks,
                    user: this.user,
                    otherUser: this.otherUser
                }));
            },

            switchToSend: function() {
                this.header.show(new HeaderCancel({
                    model: this.agreement
                }));
                this.progress.show(new ProgressBar({
                    title: "Agreement Send",
                    value: 4
                }));
                this.main.show(new SendView({
                    model: this.agreement,
                    payments: this.payments,
                    user: this.user,
                    otherUser: this.otherUser
                }));
            }

        });

        return Layout;

    }
);