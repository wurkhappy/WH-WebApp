define(['backbone', 'handlebars', 'hbs!templates/agreement/payment_methods_tpl'],

    function(Backbone, Handlebars, paymentMethodsTpl) {

        'use strict';

        var PaymentMethodsView = Backbone.View.extend({

            template: paymentMethodsTpl,
            className: "ag_subsection",
            render: function() {
                this.$el.html(this.template({
                    model: this.model.toJSON()
                }));

                return this;

            }

        });

        return PaymentMethodsView;

    }
);