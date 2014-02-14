define(['backbone', 'handlebars', 'underscore', 'marionette', 'jquery-ui',
        'hbs!templates/agreement/payment_schedule', 'views/agreement/payment_item'
    ],

    function(Backbone, Handlebars, _, Marionette, ui, tpl, PaymentItemView) {

        'use strict';

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