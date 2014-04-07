/*
 * Payments Preview View - in Create Agreement
 */

define(['backbone', 'handlebars', 'underscore', 'marionette', 'hbs!templates/create_agreement/payments_preview_tpl',
        'views/create_agreement/payments/payment_preview_item_view'
    ],

    function(Backbone, Handlebars, _, Marionette, paymentsPreviewTemplate, PaymentPreviewItemView) {

        'use strict';

        var PaymentsPreviewView = Backbone.Marionette.CompositeView.extend({

            template: paymentsPreviewTemplate,
            itemView: PaymentPreviewItemView,

        });

        return PaymentsPreviewView;

    }
);