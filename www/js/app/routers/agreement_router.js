/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

define(['backbone', 'flying-focus', 'models/agreement', 'views/agreement/layout_manager',
        'views/agreement/work_items_read_view', 'views/agreement/user_view',
        'views/agreement/edit/user_edit_view', 'views/agreement/edit/header_edit_view', 'views/agreement/edit/work_items_edit_view',
        'views/agreement/read/header_view', 'views/agreement/communication/communication_layout', 'views/agreement/payment_methods_view', 'models/user', 'views/agreement/progress_bar_view',
        'collections/tags', 'views/ui-modules/modal', 'views/landing/new_account', 'views/agreement/payment_schedule', 'views/agreement/edit/payments_edit'
    ],

    function(Backbone, FlyingFocus, AgreementModel, LayoutView, WorkItemsReadView, UserView,
        UserEditView, HeaderEditView, DeliverablesEditView, HeaderView, CommunicationLayout, PaymentMethodsView,
        UserModel, ProgressBarView, TagCollection, Modal, NewAccountView, PaymentSchedule, PaymentsEditSchedule) {

        'use strict';

        var AgreementRouter = Backbone.Router.extend({

            routes: {
                '': 'readAgreement',
                'edit': 'editAgreement',
                'new-account': 'newAccount'
            },

            initialize: function() {
                window.agreement.comments = window.comments;

                this.model = new AgreementModel(window.agreement, {
                    userID: window.thisUser.id,
                    otherUserID: window.otherUser.id
                });
                this.user = new UserModel(window.thisUser);
                this.model.userID = this.user.id;
                this.otherUser = new UserModel(window.otherUser);
                this.user.set("cards", window.cards);
                this.user.set("bank_accounts", window.bank_account);
                this.tags = new TagCollection(window.tags);
                this.tags.addMileStoneTags(this.model.get("workItems").models);
                this.layout = new LayoutView({
                    model: this.model,
                    user: this.user
                });
                FlyingFocus();
                if (!this.user.get("isRegistered")) {
                    this.newAccount();
                }
            },

            readAgreement: function() {
                if (this.originalModelData) {
                    this.model.clear({
                        silent: true
                    });
                    this.model.set(this.originalModelData);
                    this.originalModelData = null;
                }
                this.layout.agreementProgressBar.show(new ProgressBarView({
                    model: this.model
                }));
                this.layout.paymentMethods.show(new PaymentMethodsView({
                    model: this.model
                }));
                this.layout.deliverables.show(new WorkItemsReadView({
                    collection: this.model.get("workItems"),
                    user: this.user,
                    otherUser: this.otherUser,
                    messages: this.model.get("comments"),
                    tags: this.tags
                }));
                this.layout.paymentSchedule.show(new PaymentSchedule({
                    collection: this.model.get("payments"),
                    user: this.user,
                    otherUser: this.otherUser
                }));
                // this.layout.profile.show(new UserView());
                this.layout.header.show(new HeaderView({
                    model: this.model,
                    user: this.user,
                    otherUser: this.otherUser
                }));
                /*var discussionView = new CommunicationLayout({
                    messages: this.model.get("comments"),
                    user: this.user,
                    otherUser: this.otherUser,
                    tags: this.tags
                });
                this.layout.discussion.show(discussionView);*/
            },
            editAgreement: function() {
                this.originalModelData = this.model.toJSON();
                this.layout.header.show(new HeaderEditView({
                    model: this.model,
                    user: this.user
                }));
                this.layout.deliverables.show(new DeliverablesEditView({
                    model: this.model
                }));
                this.layout.paymentSchedule.show(new PaymentsEditSchedule({
                    collection: this.model.get("payments"),
                    user: this.user,
                    otherUser: this.otherUser
                }));
            },
            newAccount: function() {
                this.readAgreement();
                var view = new NewAccountView({
                    model: new UserModel(),
                    hideHaveAccount: true
                });
                view.render();
                var modal = new Modal({
                    view: view,
                    hideClose: true,
                });
                modal.show();
                this.listenTo(view, 'saveSuccess', function() {
                    modal.hide();
                    window.location.hash = "";
                });
            }

        });

        return AgreementRouter;

    }
);