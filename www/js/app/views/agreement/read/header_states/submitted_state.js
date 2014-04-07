define(['backbone', 'handlebars', 'views/agreement/read/header_states/base_state',
        'hbs!templates/agreement/accept_tpl', 'views/agreement/read/modals/reject', 'views/ui-modules/modal',
        'views/agreement/read/modals/accept_payment'
    ],

    function(Backbone, Handlebars, BaseState, payTemplate, RejectModal,
        Modal, AcceptModal) {

        'use strict';

        var SubmittedState = BaseState.extend({

            payTemplate: payTemplate,

            initialize: function(options) {
            BaseState.prototype.initialize.apply(this, [options]);
            this.button1Title = (!this.userIsStateCreator) ? "Accept " + this.statusType : "Waiting for Response";
                this.button2Title = (!this.userIsStateCreator) ? "Reject " + this.statusType : null;
                this.user = options.user;
                this.otherUser = options.otherUser;
            },
            button1: function(event) {
                var depositPayments = this.payments.where({
                    isDeposit: true
                });
                // if (!this.userIsClient || this.userIsStateCreator) return;
                var deposit = (this.userIsClient) ? depositPayments[depositPayments.length - 1] : null;
                if (this.statusType === 'payment') {
                    var view = new AcceptModal({
                        model: this.payments.findSubmittedPayment(),
                        user: this.user,
                        otherUser: this.otherUser,
                        acceptsBankTransfer: this.model.get("acceptsBankTransfer"),
                        acceptsCreditCard: this.model.get("acceptsCreditCard")
                    });
                    this.acceptModal = new Modal({
                        view: view
                    });
                    this.acceptModal.show();

                } else if (deposit && deposit.get("lastAction").get("name") === "submitted" && this.userIsClient) {

                    var view = new AcceptModal({
                        model: this.payments.findSubmittedPayment(),
                        user: this.user,
                        otherUser: this.otherUser,
                        acceptsBankTransfer: this.model.get("acceptsBankTransfer"),
                        acceptsCreditCard: this.model.get("acceptsCreditCard")
                    });
                    this.depositModal = new Modal({
                        view: view
                    });
                    this.depositModal.show();

                } else {
                    this.model.accept();
                }
            },
            button2: function(event) {
                var model = (this.statusType === 'payment') ? this.payments.findSubmittedPayment() : this.model;
                var view = new RejectModal({
                    model: model,
                    otherUser: this.otherUser
                });
                this.rejectModal = new Modal({
                    view: view
                });
                this.rejectModal.show();

            }

        });

        return SubmittedState;

    }
);