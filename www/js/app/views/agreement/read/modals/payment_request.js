define(['backbone', 'handlebars', 'toastr', 'hbs!templates/agreement/pay_request_tpl',
        'hbs!templates/agreement/pay_request_methods_tpl', 'hbs!templates/agreement/pay_request_breakout', 'models/payment'
    ],

    function(Backbone, Handlebars, toastr, payRequestTemplate, paymentMethodsTpl, paymentBreakoutTpl, PaymentModel) {

        'use strict';
        var PaymentMethods = Backbone.View.extend({

            template: paymentMethodsTpl,
            initialize: function(options) {
                this.bankAccounts = options.bankAccounts;
                this.listenTo(this.bankAccounts, 'add', this.render);
                this.render();
            },
            render: function() {
                console.log(this.bankAccounts.toJSON());
                this.$el.html(this.template({
                    bankAccounts: this.bankAccounts.toJSON()
                }));
                return this;
            }
        });

        var PaymentRequestModal = Backbone.View.extend({

            template: payRequestTemplate,
            breakoutTpl: paymentBreakoutTpl,

            events: {
                "click #pay-button": "requestPayment",
                "change #milestoneToPay": "updateMilestone",
                "click #show_fee_detail": "showFeeDetail",
                "change input[name=select_bank_account]": "changeAccount"
            },
            initialize: function(options) {
                this.payment = new PaymentModel();
                this.payment.agreementVersionID = options.payments.agreementVersionID;
                this.payment.agreementID = options.payments.agreementID;
                this.payments = options.payments;

                this.bankAccounts = options.bankAccounts;
                this.bankAccounts.fetch();
                this.paymentMethodsView = new PaymentMethods({
                    bankAccounts: this.bankAccounts
                });
                this.acceptsBankTransfer = options.acceptsBankTransfer;
                this.acceptsCreditCard = options.acceptsCreditCard;
                if (this.acceptsCreditCard && this.acceptsBankTransfer) {
                    this.allPaymentMethods = true;
                }
                this.render();
            },

            render: function(event) {


                this.$el.html(this.template(_.extend({
                    model: this.model.toJSON(),
                    payments: this.collection.toJSON(),
                    acceptsCreditCard: this.acceptsCreditCard,
                    acceptsBankTransfer: this.acceptsBankTransfer,
                    allPaymentMethods: this.allPaymentMethods
                }, this.calculatePayment())));

                this.$('header').html(this.paymentMethodsView.$el);
            },
            calculatePayment: function() {
                var milestonePayment = this.model.get("amountDue");
                var wurkHappyFee = this.wurkHappyFee(milestonePayment);
                var bankTransferFee = (milestonePayment * .01) + .55;
                if (bankTransferFee > 5) {
                    bankTransferFee = 5;
                }
                var creditCardFee = (milestonePayment * .029) + .55;
                var processingFee = (this.acceptsCreditCard === true) ? creditCardFee : bankTransferFee;

                if (!this.acceptsCreditCard) {
                    var feeTotal = bankTransferFee + wurkHappyFee;
                } else {
                    var feeTotal = creditCardFee + wurkHappyFee;
                }
                var amountTotal = milestonePayment - feeTotal;


                return {
                    milestonePayment: milestonePayment.toFixed(2),
                    wurkHappyFee: wurkHappyFee.toFixed(2),
                    bankTransferFee: bankTransferFee.toFixed(2),
                    creditCardFee: creditCardFee.toFixed(2),
                    processingFee: processingFee.toFixed(2),
                    feeTotal: feeTotal.toFixed(2),
                    amountTotal: amountTotal.toFixed(2)
                }
            },

            wurkHappyFee: function(amount) {
                var fee = amount * 0.01;
                if (fee > 10) {
                    fee = 10;
                }
                return fee;
            },
            updateMilestone: function(event) {
                var id = event.target.value;
                this.model = this.collection.get(id);

                this.$('#paymentBreakout').html(this.breakoutTpl(_.extend({
                    acceptsCreditCard: this.acceptsCreditCard,
                    acceptsBankTransfer: this.acceptsBankTransfer,
                    allPaymentMethods: this.allPaymentMethods
                }, this.calculatePayment())));
            },
            requestPayment: function(event) {

                if (this.bankAccounts.length < 1) {
                    toastr.error('Please add a bank account to receive payment');
                    return;
                }

                var fadeOutModal = function() {
                    $('#overlay').fadeOut('fast');
                };

                var fadeInNotification = function() {
                    toastr.success('Payment requested and email sent');
                };

                var triggerNotification = _.debounce(fadeInNotification, 300);

                this.payment.get("paymentItems").add({
                    workItemID: this.model.id,
                    amount: this.model.get("amountDue")
                });
                this.payments.add(this.payment, {
                    silent: true
                })
                var creditSource = this.$(".select_bank_account:checked").attr("value") || '';
                this.payment.submit({
                    creditSourceID: creditSource
                }, _.bind(function(response) {
                    fadeOutModal();
                    triggerNotification();
                    this.payments.trigger('add');
                    this.trigger("paymentRequested", this.payment);
                    this.trigger('hide');
                    if (window.production) {
                        analytics.track('Payment Requested');
                    }
                }, this));
            },

            showFeeDetail: function(event) {
                event.preventDefault();
                event.stopPropagation();
                $('.fee_detail_container').slideToggle('slow');
            },
            changeAccount: function(event) {
                console.log(event.target.value);
            }

        });

        return PaymentRequestModal;

    }
);