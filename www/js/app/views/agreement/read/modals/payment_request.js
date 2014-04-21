define(['backbone', 'handlebars', 'toastr', 'hbs!templates/agreement/pay_request_tpl',
        'hbs!templates/agreement/pay_request_methods_tpl', 'hbs!templates/agreement/pay_request_breakout', 'models/payment',
        'views/agreement/invoice_view'
    ],

    function(Backbone, Handlebars, toastr, payRequestTemplate, paymentMethodsTpl, paymentBreakoutTpl, PaymentModel, InvoiceView) {

        'use strict';
        var PaymentMethods = Backbone.View.extend({

            template: paymentMethodsTpl,
            initialize: function(options) {
                this.bankAccounts = options.bankAccounts;
                this.listenTo(this.bankAccounts, 'add', this.render);
                this.render();
            },
            render: function() {
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
                "change #milestoneToPay": "changeMilestone",
                "click #show_fee_detail": "showFeeDetail",
                "change input[name=select_bank_account]": "changeAccount"
            },
            initialize: function(options) {

                this.tasks = options.tasks;
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
                if (!this.model.get("isDeposit")) {

                    this.invoiceView = new InvoiceView({
                        model: options.agreement,
                        payment: this.model,
                        tasks: this.tasks,
                    });
                }
                this.listenTo(this.model.get("paymentItems"), "change:amountDue", this.updateMilestone);
                this.render();
            },

            render: function(event) {


                this.$el.html(this.template(_.extend({
                    model: this.model.toJSON(),
                    payments: this.collection.toJSON(),
                    payment: this.model.toJSON(),
                    acceptsCreditCard: this.acceptsCreditCard,
                    acceptsBankTransfer: this.acceptsBankTransfer,
                    allPaymentMethods: this.allPaymentMethods,
                    estimatedAmount: this.model.get("amountDue"),
                }, this.calculatePayment())));

                this.$('header').html(this.paymentMethodsView.$el);
                if (!this.model.get("isDeposit")) {
                    this.$('#invoice_table').html(this.invoiceView.$el);
                }
                _.defer(_.bind(this.updateMilestone, this));
            },
            calculatePayment: function() {
                var milestonePayment = this.model.getTotalAmount() || this.model.get("amountDue");
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
            changeMilestone: function(event) {
                var id = event.target.value;
                var newModel = this.collection.get(id);
                newModel.get("paymentItems").set(this.model.get("paymentItems").models);
                this.model = newModel;
                this.updateMilestone();
            },
            updateMilestone: function() {
                var amount = this.model.getTotalAmount() || this.model.get("amountDue");
                this.model.set("amountDue", amount);
                this.$('#paymentBreakout').html(this.breakoutTpl(_.extend({
                    acceptsCreditCard: this.acceptsCreditCard,
                    acceptsBankTransfer: this.acceptsBankTransfer,
                    allPaymentMethods: this.allPaymentMethods,
                    estimatedAmount: this.model.get("amountDue"),
                }, this.calculatePayment())));
            },
            requestPayment: function(event) {

                if (this.bankAccounts.length < 1) {
                    toastr.error('Please add a bank account to receive payment');
                    return;
                }

                if (this.model.getTotalAmount() === 0) {
                    toastr.error('Please add amounts for the invoice items');
                    return;
                }

                var fadeOutModal = function() {
                    $('#overlay').fadeOut('fast');
                };

                var fadeInNotification = function() {
                    toastr.success('Payment requested and email sent');
                };

                var triggerNotification = _.debounce(fadeInNotification, 300);

                var creditSource = this.$(".select_bank_account:checked").attr("value") || '';
                this.model.save({}, {
                    success: _.bind(function() {
                        console.log("payment save success");
                        this.model.submit({
                            creditSourceID: creditSource
                        }, _.bind(function(response) {
                            fadeOutModal();
                            triggerNotification();
                            this.trigger("paymentRequested", this.model);
                            this.trigger('hide');
                            if (window.production) {
                                analytics.track('Payment Requested');
                            }
                        }, this));
                    }, this)
                });

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