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
            appendHtml: function(collectionView, itemView, index) {
                var childAtIndex;

                // could just quickly
                // use prepend
                if (index === 0) {
                    return collectionView.$el
                        .prepend(itemView.el);

                } else {

                    // see if there is already
                    // a child at the index
                    childAtIndex = collectionView.$el
                        .children().eq(index);
                    if (childAtIndex.length) {
                        return childAtIndex
                            .before(itemView.el);
                    } else {
                        return collectionView.$el
                            .append(itemView.el);
                    }
                }
            }

        });

        return PaymentsPreviewView;

    }
);