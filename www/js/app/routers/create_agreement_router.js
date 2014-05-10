/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

define(['backbone', 'flying-focus', 'models/agreement',
        'models/user', 'collections/payments', 'collections/tasks', 'views/create_agreement/layout'
    ],

    function(Backbone, FlyingFocus, AgreementModel, UserModel, PaymentCollection, TaskCollection, Layout) {

        'use strict';

        var CreateAgreementRouter = Backbone.Router.extend({

            routes: {
                '': 'overview',
                'overview': 'overview',
                'services': 'services',
                'payment': 'payment',
                'review': 'review',
                'send': 'send'
            },

            initialize: function() {
                this.user = new UserModel(window.user);
                this.otherUser = new UserModel(window.otherUser);
                this.agreement = new AgreementModel({
                    freelancerID: this.user.id
                });
                this.payments = new PaymentCollection(window.payments);
                this.tasks = new TaskCollection(window.tasks);

                this.agreement.set({
                    acceptsCreditCard: true,
                    acceptsBankTransfer: true
                });

                if (window.agreement) {
                    this.agreement = new AgreementModel(window.agreement)
                    this.tasks.versionID = this.agreement.id;
                }
                this.tasks.versionID = this.agreement.id;
                this.payments.versionID = this.agreement.id;
                this.listenTo(this.agreement, "change:versionID", function() {
                    this.tasks.versionID = this.agreement.id;
                    this.payments.versionID = this.agreement.id;
                });

                this.layout = new Layout({
                    agreement: this.agreement,
                    user: this.user,
                    tasks: this.tasks,
                    payments: this.payments,
                    otherUser: this.otherUser
                });
                FlyingFocus();
            },
            overview: function() {
                this.layout.switchToOverview();
            },
            services: function() {
                console.log(this.agreement.id)
                if (!this.agreement.id) {
                    window.location.hash = "";
                    return;
                }
                this.layout.switchToServices();
            },
            payment: function() {
                if (!this.agreement.id) {
                    window.location.hash = "";
                    return;
                }
                this.layout.switchToPayment();
            },
            review: function() {
                if (!this.agreement.id) {
                    window.location.hash = "";
                    return;
                }
                this.layout.switchToReview();
            },
            send: function() {
                if (!this.agreement.id) {
                    window.location.hash = "";
                    return;
                }
                this.layout.switchToSend();
            }
        });

        return CreateAgreementRouter;

    }
);