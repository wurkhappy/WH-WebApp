/* 
 * Payment Preview Item View - in Create Agreement.
 * A unit of work, previewed in the agreement.
 * Item View, listens.
 */

define(['backbone', 'handlebars', 'underscore', 'hbs!templates/create_agreement/payment_preview_item_tpl'],

    function(Backbone, Handlebars, _, paymentPreviewItemTemplate) {

        'use strict';

        var PaymentPreviewView = Backbone.Marionette.ItemView.extend({

            template: paymentPreviewItemTemplate,

            initialize: function(options) {
                this.listenTo(this.model.get("paymentItems"), "add", this.render);
                this.listenTo(this.model.get("paymentItems"), "remove", this.render);
                this.listenTo(this.model, "change", this.render);
            },
            serializeData: function() {
                var data = this.model.toJSON();
                if (!this.model.collection.models[0].get("isDeposit")) {
                    data.number += 1;
                }
                return data;
            },

        });

        return PaymentPreviewView;

    }
);