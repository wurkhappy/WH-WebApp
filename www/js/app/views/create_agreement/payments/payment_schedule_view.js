/*
 * Payment Schedule View - in Create Agreement
 * Composite view for payments collection
 */

define(['backbone', 'handlebars', 'underscore', 'marionette', 'toastr', 'parsley', 'autonumeric',
        'hbs!templates/create_agreement/payment_schedule_tpl', 'views/create_agreement/payments/payment_item_view',
    ],

    function(Backbone, Handlebars, _, Marionette, toastr, parsley, autoNumeric, paymentScheduleTemplate, PaymentItem) {

        'use strict';

        var PaymentView = Backbone.Marionette.CompositeView.extend({

            template: paymentScheduleTemplate,

            itemView: PaymentItem,
            itemViewOptions: function() {
                return {
                    workItems: this.model.get("workItems")
                };
            },

            initialize: function(options) {
                this.router = options.router;
                this.deposit = this.collection.findDeposit();
                this.bankAccounts = options.user.get("bank_accounts");
                this.creditCards = options.user.get("cards");
                if (this.collection.length === 0) {
                    this.collection.add({})
                }
            },

            events: {
                "click .payment_method": "updatePaymentMethods",
                'focus .currency_format': 'triggerCurrencyFormat',
            },

            renderModel: function() {
                var data = {};
                if (this.deposit) data = this.deposit.toJSON();
                data.totalAmount = this.model.get("totalAmount");

                //if credit card & bank transfer payment methods are set by default, add them to data object to be rendered
                // in estimate template
                if (this.model.get("acceptsCreditCard")) data.acceptsCreditCard = this.model.get("acceptsCreditCard");
                if (this.model.get("acceptsBankTransfer")) data.acceptsBankTransfer = this.model.get("acceptsBankTransfer");

                data = this.mixinTemplateHelpers(data);

                var template = this.getTemplate();
                return Marionette.Renderer.render(template, data);
            },

            onRender: function() {
                $('body').scrollTop(0);
            },

            appendHtml: function(collectionView, itemView, index) {
                if (itemView.model.get("title") === 'Deposit') {
                    return;
                }
                itemView.$el.insertBefore(collectionView.$('#bottomDiv'));
            },

                        updatePaymentMethods: function(event) {
                if (!event.target.name) return;
                if (event.target.checked) {
                    this.model.set(event.target.name, true);
                } else {
                    this.model.set(event.target.name, false);
                }
            },

            triggerCurrencyFormat: function() {
                $('.currency_format').autoNumeric('init', {
                    aSign: '$ ',
                    pSign: 'p',
                    vMin: '0',
                    vMax: '100000'
                });
            }
        });

        return PaymentView;

    }
);