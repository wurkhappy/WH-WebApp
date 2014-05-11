define(['backbone', 'handlebars', 'toastr', 'parsley', 'hbs!templates/create_agreement/send_tpl',
        'views/agreement/read/modals/payment_request', 'views/ui-modules/modal', 'views/create_agreement/verify_user', 'views/landing/new_account'
    ],

    function(Backbone, Handlebars, toastr, parsley, tpl, DepositRequestModal, Modal, VerifyUserView, NewAccountView) {

        'use strict';

        var SendView = Backbone.View.extend({
            template: tpl,
            className: 'clear white_background',
            events: {
                "click #sendAgreement": "clickedSend",
                "blur textarea": "addMessage",
                "blur #client-email": "addRecipient",
                "blur .user-info": "updateUserInfo",
            },
            initialize: function(options) {
                this.message = "Please take a moment to look over the details of the services provided and the payment schedule. Let me know if you'd like to suggest any changes. When you're ready, just accept the agreement and we'll get started.";
                this.user = options.user;
                this.user.get("bank_accounts").fetch();
                this.otherUser = options.otherUser;
                this.payments = options.payments;
                this.render();
            },
            render: function() {
                this.deposit = this.payments.findDeposit();
                this.hasDeposit;

                if (this.deposit && this.user.id === this.model.get("freelancerID")) {
                    this.hasDeposit = true;
                }
                var otherUserEmail = (this.otherUser) ? this.otherUser.get("email") : null;
                this.$el.html(this.template({
                    thisUser: this.user.toJSON(),
                    message: this.message,
                    deposit: this.hasDeposit,
                    otherUserEmail: otherUserEmail,
                }));
                $('body').scrollTop(0);

                return this;
            },
            addRecipient: function(event) {
                this.model.set("clientEmail", event.target.value);
            },
            addMessage: function(event) {
                this.message = event.target.value
            },
            clickedSend: _.debounce(function(event) {
                event.preventDefault();
                event.stopPropagation();
                if (!this.user.id) {
                    this.newAccount();
                    return;
                }
                this.sendAgreement();

            }, 500, true),
            sendAgreement: function() {
                if (!this.validate()) {
                    return;
                }
                if (this.payments.findDeposit()) {
                    this.requestDeposit();
                    return;
                }

                this.submitAgreement();
            },
            submitAgreement: function() {

                var that = this;

                this.model.save({}, {
                    success: function(model, response) {

                        toastr.success('Agreement Sent');

                        var changeWindow = function() {
                            window.location = "/home";
                        };
                        var submitSuccess = _.debounce(changeWindow, 800); //delay the change in window until after success notification

                        that.model.submit(that.message, submitSuccess);
                    }
                });
            },
            requestDeposit: function() {
                if (!this.validate()) {
                    return;
                }

                var that = this;

                this.model.save({}, {
                    success: function(model, response) {
                        if (that.user.get("bank_accounts").length > 0) {
                            var view = new DepositRequestModal({
                                model: that.deposit,
                                collection: that.payments,
                                payments: that.payments,
                                cards: that.user.get("cards"),
                                bankAccounts: that.user.get("bank_accounts"),
                                acceptsBankTransfer: that.model.get("acceptsBankTransfer"),
                                acceptsCreditCard: that.model.get("acceptsCreditCard")
                            });
                            that.modal = new Modal({
                                view: view
                            });
                            that.listenTo(that.modal.view, "paymentRequested", that.depositRequested);
                            that.modal.show();
                        } else {
                            that.deposit.submit({}, function() {
                                if (window.production) {
                                    analytics.track('Deposit Requested');
                                }
                                that.depositRequested();
                            });
                        }
                    }
                });
            },
            validate: function() {
                //return if there isn't a valid email
                var isValid = $('#create_agreement_send_email').parsley('validate');
                if (!isValid) {
                    return false;
                }

                if (!this.model.get("clientID") && !this.model.get("clientEmail")) return false;

                return true;
            },
            depositRequested: function() {
                this.model.submit(this.message, function() {
                    if (window.production) {
                        analytics.track('Agreement Sent');
                    }
                    window.location = "/home";
                });
            },
            updateUserInfo: function(event) {
                this.user.set(event.target.name, event.target.value);
                console.log(this.user);
            },
            newAccount: function() {
                var view = new NewAccountView({
                    model: this.user
                });
                this.modal = new Modal({
                    view: view
                });
                this.listenTo(view, "saveSuccess", function() {
                    if (this.model.isClient) {
                        this.model.set("clientID", this.user.id);
                    } else {
                        this.model.set("freelancerID", this.user.id);
                    }
                    this.modal.hide();
                    this.sendAgreement();
                });
                this.modal.show();
            }
        });

        return SendView;

    });