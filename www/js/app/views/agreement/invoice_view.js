define(['backbone', 'handlebars', 'hbs!templates/agreement/invoice', 'views/agreement/invoice_table'],

    function(Backbone, Handlebars, itemTpl, InvoiceTable) {

        'use strict';

        var InvoiceView = Backbone.View.extend({

            template: itemTpl,
            events: {
                "change input[name=ishourly]": "changeTable"
            },
            initialize: function(options) {
                this.payment = options.payment;
                console.log(this.model.get("workItems").getNonPartiallyPaid());
                this.workItems = this.model.get("workItems").getNonPartiallyPaid().getCompleted();
                this.tasks = this.model.get("workItems").getTasks().getUnpaid().getCompleted();
                this.tasks.remove(this.workItems.getTasks().models);
                var workItemsJSON = this.workItems.toJSON();
                _.each(workItemsJSON, function(item) {
                    item.workItemID = item.id;
                });
                var tasks = [];
                this.tasks.each(function(model) {
                    var json = model.toJSON();
                    json.taskID = model.id;
                    json.workItemID = model.getWorkItemID();
                    tasks.push(json);
                })
                this.payment.get("paymentItems").set(workItemsJSON.concat(tasks));
                this.listenTo(this.payment.get("paymentItems"), "change:amountDue", this.upateCost);
                this.render();
            },
            render: function() {
                this.$el.html(this.template({}));
                this.table = new InvoiceTable({
                    collection: this.payment.get("paymentItems")
                });
                this.$('#invoice_items_section').html(this.table.el);
                this.totalCost = this.$('#paymentTotal');
                return this;

            },
            changeTable: function(event) {
                if (event.target.value === 'yes') {
                    this.table.changeToHourly();
                } else {
                    this.table.changeToItems();
                }
            },
            upateCost: function() {
                this.totalCost.text('$' + this.payment.get("paymentItems").getTotalAmountDue());
            }

        });

        return InvoiceView;

    }
);