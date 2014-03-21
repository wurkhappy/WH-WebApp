/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

define(['backbone', 'flying-focus', 'models/agreement',
        'models/user', 'views/create_agreement/layout'
    ],

    function(Backbone, FlyingFocus, AgreementModel, UserModel, Layout) {

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
                this.model = new AgreementModel({
                    freelancerID: this.user.id
                });

                this.model.set({
                    acceptsCreditCard: true
                });

                this.model.set({
                    acceptsBankTransfer: true
                });

                if (window.agreement) {
                    this.model = new AgreementModel(window.agreement)
                }

                this.model.userID = this.user.id;

                this.layout = new Layout({
                    model: this.model,
                    user: this.user,
                    otherUser: this.otherUser
                });
                FlyingFocus();
            },
            overview: function() {
                this.layout.switchToOverview();
            },
            services: function() {
                this.layout.switchToServices();
            },
            payment: function() {
                this.layout.switchToPayment();
            },
            review: function() {
                this.layout.switchToReview();
            },
            send: function() {
                this.layout.switchToSend();
            }
        });

        return CreateAgreementRouter;

    }
);