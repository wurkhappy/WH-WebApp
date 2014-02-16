define(['backbone', 'handlebars', 'underscore', 'marionette',
        'hbs!templates/agreement/edit/payments_edit', 'views/agreement/payment_item',
        'views/agreement/edit/payment_item'
    ],

    function(Backbone, Handlebars, _, Marionette, workItemEditTemplate, WorkItemPaidView, WorkItemView) {

        'use strict';

        var PaymentEditView = Backbone.Marionette.CompositeView.extend({

            template: workItemEditTemplate,

            itemView: WorkItemView,
            itemViewContainer: 'ul',

            events: {
                "click #addPaymentButton": "addPayment"
            },
            renderModel: function() {
                var data = {};
                data.totalDue = this.collection.getTotalDue();
                data.totalPaid = this.collection.getTotalPaid();
                data = this.mixinTemplateHelpers(data);

                var template = this.getTemplate();
                return Marionette.Renderer.render(template, data);
            },
            getItemView: function(item) {
                if (item.isPaid()) return WorkItemPaidView;
                return WorkItemView;
            },
            addPayment: function(event) {
                event.preventDefault();
                event.stopPropagation();

                this.collection.add({});
            },

        });

        return PaymentEditView;

    }
);