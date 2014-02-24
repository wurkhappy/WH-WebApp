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

                return data;
            },
        });

        return PaymentItemView;

    }
);