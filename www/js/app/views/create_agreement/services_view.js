/*
 * Services View - Create Agreement View.
 * Composite view that houses work item collection
 * A work item is basically one service.
 */

define(['backbone', 'handlebars', 'underscore', 'marionette', 'toastr', 'parsley', 'autonumeric',
        'hbs!templates/create_agreement/services_tpl', 'views/create_agreement/work_item_view',
        'views/create_agreement/payment_schedule'
    ],

    function(Backbone, Handlebars, _, Marionette, toastr, parsley, autoNumeric, servicesTemplate, WorkItemView,
        PaymentSchedule) {

        'use strict';

        var ServicesView = Backbone.Marionette.CompositeView.extend({

            template: servicesTemplate,

            itemView: WorkItemView,

            initialize: function(options) {
                this.router = options.router;
                this.deposit = this.collection.findDeposit();
                this.bankAccounts = options.user.get("bank_accounts");
                this.creditCards = options.user.get("cards");
                if (this.collection.length === 0) {
                    this.collection.add({})
                };
            },

            updatePaymentMethods: function(event) {
                if (!event.target.name) return;
                if (event.target.checked) {
                    this.model.set(event.target.name, true);
                } else {
                    this.model.set(event.target.name, false);
                }
            },
            renderModel: function() {
                var data = {};
                if (this.deposit) data = this.deposit.toJSON();

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
            }
        });

        return ServicesView;

    }
);