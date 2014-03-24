/* 
 * Payment Terms View - in Create Agreement.
 * Houses the agreement deposit as well as accepted payment methods
 */

define(['backbone', 'handlebars', 'underscore', 'hbs!templates/create_agreement/payment_terms_tpl'],

    function(Backbone, Handlebars, _, paymentTermsTemplate) {

        'use strict';

        var PaymentTermsView = Backbone.Marionette.ItemView.extend({

            template: paymentTermsTemplate,

            initialize: function(options) {
                this.bankAccounts = options.user.get("bank_accounts");
                this.creditCards = options.user.get("cards");
                this.acceptsCreditCard = options.acceptsCreditCard;
                this.acceptsBankTransfer = options.acceptsBankTransfer;
                this.deposit = this.model.get("payments").findDeposit();
                if (this.deposit) {
                    this.depositAmount = this.model.get("payments").findDeposit().get("amountDue");
                }

            },

            serializeData: function() {
                var depositAmount;
                if (this.deposit) depositAmount = this.deposit.get("amountDue");
                return {
                    depositAmount: this.depositAmount,
                    acceptsCreditCard: this.acceptsCreditCard,
                    acceptsBankTransfer: this.acceptsBankTransfer
                }
            },

            events: {
                "blur #deposit": "updateDeposit",
                'focus .currency_format': 'triggerCurrencyFormat'
            },

            triggerCurrencyFormat: function() {
                $('.currency_format').autoNumeric('init', {
                    aSign: '$ ',
                    pSign: 'p',
                    vMin: '0',
                    vMax: '100000'
                });
            },

            updateDeposit: function(event) {
                var amount = event.target.value;
                var adjAmount = (amount.substring(0, 2) === '$ ') ? amount.substring(2) : amount;
                var formattedAmount = parseFloat(adjAmount.replace(/,/g, ''), 10);

                // The problem here is that once a deposit is created and removed it can't be added again.
                // Because the 

                if (this.deposit) {
                    this.deposit.set("amountDue", formattedAmount);
                    this.deposit.get("paymentItems").at(0).set("amountDue", formattedAmount);
                } else {
                    var Model = this.model.get("payments").model;
                    this.deposit = new Model({
                        title: "Deposit",
                        amountDue: formattedAmount,
                        isDeposit: true,
                        paymentItems: [{
                            amountDue: formattedAmount,
                            title: "Deposit",
                        }]
                    });
                    this.model.get("payments").unshift(this.deposit);
                }
                console.log(this.model.get("payments").indexOf(this.deposit));

                if (adjAmount == 0) {
                    this.model.get("payments").remove(this.deposit);
                } else {
                    this.model.get("payments").unshift(this.deposit);
                }
                console.log(this.model.get("payments").indexOf(this.deposit));
            }

        });

        return PaymentTermsView;

    }
);