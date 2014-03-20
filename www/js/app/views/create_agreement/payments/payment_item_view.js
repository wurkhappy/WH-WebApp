/* 
 * Payment Item View - in Create Agreement
 * Regular backbone view under payment_schedule_view.js
 */

define(['backbone', 'handlebars', 'underscore', 'kalendae', 'autonumeric',
        'hbs!templates/create_agreement/payment_item'
    ],

    function(Backbone, Handlebars, _, Kalendae, autoNumeric, itemTpl) {

        'use strict';

        var WorkItemView = Backbone.View.extend({

            tagName: 'div',
            className: 'paymentItemCreate',

            template: itemTpl,

            initialize: function(options) {
                
                this.workItems = options.workItems;
                this.router = options.router;

                this.render();
                
            },

            render: function() {
                var deposit = this.model.isDeposit();
                this.$el.html(this.template({
                    model: this.model.toJSON(),
                    deposit: deposit,
                    workItems: this.workItems.toJSON(),
                }));
                this.$el.fadeIn('slow');
                return this;
            },
            
            events: {
                "blur input": "updateFields",
                "blur .paymentAmount": "updateAmount",
                "focus .kal": "triggerCalender",
                "click #removePayment": "removeModel",
                'focus .currency_format': 'triggerCurrencyFormat',
                "change .item_check": "updateItemsIncluded"
            },
            updateAmount: function(event) {

                var amount = event.target.value;
                var adjAmount = (amount.substring(0, 2) === '$ ') ? amount.substring(2) : amount;

                this.model.set(event.target.name, parseInt(adjAmount.replace(/,/g, ''), 10));
            },
            updateFields: function(event) {
                if (!event.target.name) return;
                if (event.target.name === 'dateExpected') {
                    this.model.set("dateExpected", moment(event.target.value));
                    return;
                }

                this.model.set(event.target.name, event.target.value);

            },
            triggerCalender: function(event) {

                var oneWeekFromToday = moment().add('days', 7).calendar();

                if (!this.calendar) {
                    this.calendar = new Kalendae.Input(this.$(".kal")[0], {
                        selected: oneWeekFromToday,
                        direction: 'today-future'
                    });
                    this.calendar.subscribe('date-clicked', _.bind(this.setDate, this));
                }
                if (!this.model.get("dateExpected")) {
                    this.calendar.setSelected(oneWeekFromToday);
                };
            },
            setDate: function(date, action) {
                this.model.set("dateExpected", date);
                _.delay(this.closeCalendar, 150);
                this.$('.kal').val(date.format('MM/DD/YYYY'))
                this.$('.kal').blur();
            },
            closeCalendar: function() {
                $('.kalendae').hide();
            },
            removeModel: function(event) {
                event.preventDefault();

                var that = this;
                that.$el.fadeOut('fast');
                _.delay(function() {
                    that.model.collection.remove(that.model);
                }, 1000);
            },

            triggerCurrencyFormat: function() {
                this.$('.currency_format').autoNumeric('init', {
                    aSign: '$ ',
                    pSign: 'p',
                    vMin: '0',
                    vMax: '100000'
                });
            },
            updateItemsIncluded: function(event) {
                var paymentItems = this.model.get("paymentItems");
                //console.log($(event.target).data("cid"));
                if (paymentItems.get($(event.target).data("cid"))) {
                    paymentItems.remove(paymentItems.get($(event.target).data("cid")));
                    //console.log(paymentItems);
                    return;
                }
                var workItemID = $(event.target).data("itemid");
                var taskID = $(event.target).data("taskid");
                var collection = paymentItems.add({
                    taskID: taskID,
                    workItemID: workItemID
                });
                $(event.target).data("cid", collection.at(collection.length - 1).cid);
                //console.log(paymentItems);
            }

        });

        return WorkItemView;

    }
);