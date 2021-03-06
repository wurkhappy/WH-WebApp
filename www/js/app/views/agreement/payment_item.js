define(['backbone', 'handlebars', 'underscore', 'marionette', 'hbs!templates/agreement/payment_item'],

    function(Backbone, Handlebars, _, Marionette, ItemTpl) {

        'use strict';

        var PaymentItemView = Backbone.Marionette.ItemView.extend({
            template: ItemTpl,
            tagName: "li",
            serializeData: function() {
                var data = {};

                data = this.model.toJSON();
                data.paid = this.model.get("amountPaid") === this.model.get("amountDue");
                if (!this.model.collection.models[0].get("isDeposit")) {
                    data.number += 1;
                }

                return data;
            },
        });

        return PaymentItemView;

    }
);