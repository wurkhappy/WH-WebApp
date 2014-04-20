define(['backbone', 'flying-focus', 'models/agreement', 'views/agreement/layout_manager',
        'views/agreement/work_items_read_view', 'views/agreement/user_view',
        'views/agreement/edit/user_edit_view', 'views/agreement/edit/header_edit_view', 'views/agreement/edit/work_items_edit_view',
        'views/agreement/read/header_view', 'views/agreement/communication/communication_layout', 'views/agreement/payment_methods_view', 'models/user', 'views/agreement/progress_bar_view',
        'views/ui-modules/modal', 'views/landing/new_account', 'views/agreement/payment_schedule', 'views/agreement/edit/payments_edit',
        'collections/payments', 'collections/tasks', 'views/landing/loginview'
    ],

    function(Backbone, FlyingFocus, AgreementModel, LayoutView, WorkItemsReadView, UserView,
        UserEditView, HeaderEditView, DeliverablesEditView, HeaderView, CommunicationLayout, PaymentMethodsView,
        UserModel, ProgressBarView, Modal, NewAccountView, PaymentSchedule, PaymentsEditSchedule, PaymentCollection,
        TaskCollection, LogInView) {

        'use strict';

        var AgreementRouter = Backbone.Router.extend({

            routes: {
                '': 'readAgreement',
                'edit': 'editAgreement',
                'new-account': 'newAccount'
            },

            initialize: function() {
                this.model = new AgreementModel(window.agreement, {
                    userID: window.thisUser.id,
                    otherUserID: window.otherUser.id
                });
                this.user = new UserModel(window.thisUser);
                this.model.userID = this.user.id;
                this.otherUser = new UserModel(window.otherUser);
                this.payments = new PaymentCollection(window.payments)
                this.tasks = new TaskCollection(window.tasks)

                this.layout = new LayoutView({
                    model: this.model,
                    user: this.user
                });
                FlyingFocus();
                if (!this.user.get("isRegistered")) {
                    this.newAccount();
                } else if (!window.signedIn) {
                    this.signIn();
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
                    model: this.model,
                    tasks: this.tasks,
                }));
                this.layout.paymentMethods.show(new PaymentMethodsView({
                    model: this.model
                }));
                this.layout.deliverables.show(new WorkItemsReadView({
                    collection: this.tasks,
                    user: this.user,
                    otherUser: this.otherUser,
                    tags: this.tags
                }));
                this.layout.paymentSchedule.show(new PaymentSchedule({
                    collection: this.payments,
                    user: this.user,
                    otherUser: this.otherUser
                }));
                this.layout.header.show(new HeaderView({
                    model: this.model,
                    user: this.user,
                    otherUser: this.otherUser,
                    payments: this.payments,
                    tasks: this.tasks
                }));
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
                    collection: this.payments,
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
            },
            signIn: function() {
                this.readAgreement();
                var view = new LogInView({
                    model: new UserModel(),
                    hideHaveAccount: true
                });
                view.render();
                var modal = new Modal({
                    view: view,
                    hideClose: true,
                });
                modal.show();
                this.listenTo(view, 'saveSuccess', function(response) {
                    modal.hide();
                    window.location = window.location.origin + window.location.pathname;
                });
            }

        });

        return AgreementRouter;

    }
);