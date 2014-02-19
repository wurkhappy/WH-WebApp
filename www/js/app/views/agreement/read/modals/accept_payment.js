define(['backbone', 'handlebars', 'toastr', 'views/agreement/read/header_states/base_state',
        'hbs!templates/agreement/accept_tpl', 'views/agreement/read/modals/reject', 'views/ui-modules/modal',
        'views/account/new_card_view', 'views/account/new_bank_account_view'
    ],

    function(Backbone, Handlebars, toastr, BaseState, payTemplate, RejectModal, Modal, NewCardView, NewBankAccountView) {

        'use strict';

        var AcceptPayment = Backbone.View.extend({

            payTemplate: payTemplate,

            initialize: function(options) {
                this.button1Title = (this.userIsClient) ? "Accept " + this.statusType : "Waiting for Response";
                this.user = options.user;
                this.user.get("cards").fetch();
                this.user.get("bank_accounts").fetch();

                this.listenTo(this.user.get("cards"), "add", this.render);
                this.listenTo(this.user.get("bank_accounts"), "add", this.render);

                this.otherUser = options.otherUser;

                this.acceptsBankTransfer = options.acceptsBankTransfer;
                this.acceptsCreditCard = options.acceptsCreditCard;

                this.bankAccounts = this.user.get("bank_accounts");
                this.creditCards = this.user.get("cards");

                this.render();
            },
            render: function() {
                var milestonePayment = this.model.getTotalAmount();
                var amountTotal = milestonePayment;
                var creditCards = this.creditCards;
                var bankAccounts = this.bankAccounts;
                var acceptsBankTransfer = this.acceptsBankTransfer;
                var acceptsCreditCard = this.acceptsCreditCard;
                var hasBankAccounts;
                var hasCreditCards;

                if (bankAccounts.length > 0) {
                    hasBankAccounts = true;
                } else {
                    hasBankAccounts = false;
                }

                if (creditCards.length > 0) {
                    hasCreditCards = true;
                } else {
                    hasCreditCards = false;
                }

                this.$el.html(this.payTemplate({
                    milestonePayment: milestonePayment,
                    amountTotal: amountTotal,
                    creditCards: creditCards.toJSON(),
                    bankAccounts: bankAccounts.toJSON(),
                    acceptsCreditCard: acceptsCreditCard,
                    acceptsBankTransfer: acceptsBankTransfer,
                    hasCreditCards: hasCreditCards,
                    hasBankAccounts: hasBankAccounts
                }));

                $(".payment_select_container").hide();
            },

            events: {
                "click #accept-button": "acceptRequest",
                "click .select_radio": "selectPaymentMethod",
                "click #add_card": "addCreditCard",
                "click #add_account": "addBankAccount",
                "click #back-button": "backToMain"
            },

            paymentTotal: function(milestonePayment, fee) {
                return milestonePayment - fee;
            },

            selectPaymentMethod: function(event) {

                var $radio = $(event.target),
                    $type = $radio.val(),
                    paymentMethod;

                $(".payment_select_container").not("#" + $type).slideUp("fast");
                $("#" + $type).slideDown("fast");

                paymentMethod = document.querySelector('.select_' + $type);
                paymentMethod.setAttribute("checked", "checked");
                paymentMethod.checked = true;
            },

            acceptRequest: function(event) {
                event.preventDefault();
                event.stopPropagation();

                var bankAccount = $(".select_bank_account:checked").val();
                var canDebit = $(".select_bank_account:checked").attr('data-debit');
                var creditCard = $(".select_credit_card:checked").val()
                var $debitSource = bankAccount || creditCard || '';
                var paymentType = (bankAccount) ? "BankBalanced" : "CardBalanced";

                if (!$debitSource) {
                    toastr.error('Please select a credit card or bank account');
                    return;
                }


                if ($debitSource === bankAccount && !canDebit) {
                    toastr.error('Please verify your bank account in order to make payment');
                    return;
                } else {
                    this.model.accept($debitSource, paymentType);

                    var fadeInNotification = function() {
                        toastr.success('Payment Accepted');
                    };

                    var triggerNotification = _.debounce(fadeInNotification, 300);
                    this.trigger('hide');
                    triggerNotification();
                    analytics.track('Payment Made');
                }

            },
            addCreditCard: function(event) {
                event.preventDefault();
                event.stopPropagation();

                var view = new NewCardView({
                    user: this.user
                });
                this.listenTo(view, 'cardSaved', this.backToMain);
                this.$('#addView').append(view.el);

                this.addPaymentMethodAnimate(610);
            },
            addBankAccount: function(event) {
                event.preventDefault();
                event.stopPropagation();

                window.location = "/account#bankaccount"
            },
            addPaymentMethodAnimate: function(height) {
                var panel = $('#panel')
                this.$('#addView').animate({
                    'margin-top': '-' + panel.height() + 'px',
                    "height": panel.height()
                });
                $('#panel').height(height);
            },
            backToMain: function() {
                this.$('#addView').animate({
                    "margin-left": "-1000px"
                });
                $('#panel').css({
                    'height': 'auto'
                });
                setTimeout(_.bind(function() {
                    this.$('#addView').css({
                        "margin-top": "50px",
                        "margin-left": "-20px"
                    });
                    this.render();
                }, this), 1000);

            }

        });

        return AcceptPayment;

    }
);