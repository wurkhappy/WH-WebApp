define(['backbone', 'handlebars', 'underscore', 'marionette', 'jquery-ui',
        'hbs!templates/agreement/payment_schedule', 'hbs!templates/agreement/payment_item'
    ],

    function(Backbone, Handlebars, _, Marionette, ui, tpl, ItemTpl) {

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


        var PaymentView = Backbone.Marionette.CompositeView.extend({

            template: tpl,
            className: "ag_subsection",

            itemView: PaymentItemView,
            itemViewContainer: 'ul',

            initialize: function(options) {
                this.render();
            },
            renderModel: function() {
                var data = {};
                data.totalDue = this.collection.getTotalDue();
                data.totalPaid = this.collection.getTotalPaid();
                data = this.mixinTemplateHelpers(data);

                var template = this.getTemplate();
                return Marionette.Renderer.render(template, data);
            },
            onRender: function() {
                this.$('#payment_progress').progressbar({
                    value: (this.collection.getTotalPaid() * 100 / this.collection.getTotalDue()),
                });
            }

        });

        return PaymentView;

    }
);