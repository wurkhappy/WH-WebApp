define(['backbone', 'handlebars', 'hbs!templates/agreement/invoice_table', 'views/agreement/invoice_items'],

    function(Backbone, Handlebars, tpl, InvoiceItem) {

        'use strict';

        var InvoiceView = Backbone.View.extend({

            template: tpl,
            initialize: function(options) {
                this.listenTo(this.collection, "remove", this.render);
                this.render();
            },
            render: function() {
                var html = $(this.template({
                    hourly: this.hourly
                }))
                var hourly = this.hourly;
                this.collection.each(function(model) {
                    var view = new InvoiceItem({
                        model: model,
                        hourly: hourly,
                    });
                    html.append(view.$el);
                })
                this.$el.html(html);
                return this;

            },
            changeToHourly: function() {
                this.hourly = true;
                this.render();
            },
            changeToItems: function() {
                this.hourly = false;
                this.render();
            }

        });

        return InvoiceView;

    }
);