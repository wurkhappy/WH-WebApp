define(['backbone', 'handlebars', 'toastr', 'parsley', 'hbs!templates/create_agreement/send_tpl',
        'views/agreement/read/modals/payment_request', 'views/ui-modules/modal', 'views/create_agreement/verify_user'
    ],

    function(Backbone, Handlebars, toastr, parsley, tpl, DepositRequestModal, Modal, VerifyUserView) {

        'use strict';

        var SendView = Backbone.View.extend({
            template: tpl,
            className: 'clear white_background',
            events: {
                "click #sendAgreement": "debounceSendAgreement",
                "blur textarea": "addMessage",
                "blur input": "addRecipient",
                "click #requestDeposit": "requestDeposit"
            },
            initialize: function(options) {
                this.message = "Please take a moment to look over the details of the services provided and the payment schedule. Let me know if you'd like to suggest any changes. When you're ready, just accept the agreement and we'll get started.";
                this.user = options.user;
                this.otherUser = options.otherUser;
                this.render();
            },
            render: function() {
                this.deposit = this.model.get("workItems").at(0);
                this.hasDeposit;

                if (this.deposit && this.deposit.get("required") && this.deposit.get("amountDue") > 0 && this.user.id === this.model.get("freelancerID")) {
                    this.hasDeposit = true;
                }
                var otherUserEmail = (this.otherUser) ? this.otherUser.get("email") : null;
                this.$el.html(this.template({
                    message: this.message,
                    deposit: this.hasDeposit,
                    otherUserEmail: otherUserEmail,
                }));
                $('body').scrollTop(0);

                return this;
            },

            debounceSendAgreement: function(event) {
                event.preventDefault();
                event.stopPropagation();
                this.sendAgreement();
            },
            sendAgreement: _.debounce(function(event) {

                if (!this.isUserVerified()) {
                    return;
                }
                //return if there isn't a valid email
                var isValid = $('#create_agreement_send_email').parsley('validate');
                if (!isValid) {
                    return;
                }

                if (!this.model.get("clientID") && !this.model.get("clientEmail")) {
                    return;
                }

                if (!this.model.get("acceptsBankTransfer") && !this.model.get("acceptsCreditCard")) {
                    toastr.error("Please select a payment method in the Payment Section");
                    return;
                }

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
            }, 500, true),
            addRecipient: function(event) {
                this.model.set("clientEmail", event.target.value);
            },
            addMessage: function(event) {
                this.message = event.target.value
            },
            requestDeposit: function(event) {
                event.preventDefault();
                event.stopPropagation();
                if (!this.isUserVerified()) {
                    return;
                }

                //return if there isn't a valid email
                var isValid = $('#create_agreement_send_email').parsley('validate');
                if (!isValid) {
                    return;
                }

                if (!this.model.get("acceptsBankTransfer") && !this.model.get("acceptsCreditCard")) {
                    toastr.error("Please select a payment method in the Payment Section");
                    return;
                }

                if (!this.model.get("clientID") && !this.model.get("clientEmail")) return;

                var that = this;

                this.model.save({}, {
                    success: function(model, response) {
                        var view = new DepositRequestModal({
                            model: that.deposit,
                            collection: that.model.get("workItems"),
                            payments: that.model.get("payments"),
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
                        analytics.track('Agreement Sent');
                    }
                });
            },
            depositRequested: function() {
                this.model.submit(this.message, function() {
                    window.location = "/home";
                });
            },
            isUserVerified: function() {
                if (!this.user.get("isProcessorVerified")) {
                    var view = new VerifyUserView({
                        model: this.user
                    });
                    this.modal = new Modal({
                        view: view
                    });
                    this.modal.show();
                    this.listenTo(view, "userVerified", this.userVerified);
                    return false
                }
                return true;
            },
            userVerified: function() {
                this.modal.hide();
                if (this.hasDeposit) {
                    this.requestDeposit();
                    return;
                }
                this.sendAgreement();
            }
        });

        return SendView;

    }
);