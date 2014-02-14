define(['backbone', 'handlebars', 'hbs!templates/agreement/invoice_cost', 'hbs!templates/agreement/invoice_hourly'],

    function(Backbone, Handlebars, costTpl, hourlyTpl) {

        'use strict';

        var InvoiceView = Backbone.View.extend({

            template: costTpl,
            tagName: 'tr',
            events: {
                "blur input": "updateFields",
                "keypress input": "validateInput",
                "click a": "removeItem"
            },
            initialize: function(options) {
                if (options.hourly) {
                    this.template = hourlyTpl
                }
                this.listenTo(this.model, "change", this.updateCost);
                this.render();
            },
            render: function() {
                this.$el.html(this.template(this.model.toJSON()));
                this.costCell = this.$('.row_amountDue');
                return this;

            },
            changeToHourly: function() {
                this.template = hourlyTpl;
                this.render();
            },
            changeToItems: function() {
                this.template = costTpl;
                this.render();
            },
            updateFields: function(event) {
                this.model.set(event.target.name, event.target.value)
            },
            validateInput: function(event) {
                var evt = event || window.event;
                var charCode = evt.which || evt.keyCode;
                var charTyped = String.fromCharCode(charCode);
                var exp = (/(^\d+$)|(^\d+.\d+$)|[,.]/);
                return exp.test(charTyped);
            },
            updateCost: function(event) {
                if (this.model.get("hours") && this.model.get("rate")) {
                    this.model.set("amountDue", this.model.get("hours") * this.model.get("rate"));
                    this.costCell.text(this.model.get("amountDue"))
                }
            },
            removeItem: function(event) {
                this.model.collection.remove(this.model);
            }

        });

        return InvoiceView;

    }
);