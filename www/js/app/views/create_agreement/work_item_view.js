/* 
 * Scope of Work - Create Agreement View.
 */

define(['backbone', 'handlebars', 'underscore', 'kalendae', 'autonumeric', 'hbs!templates/create_agreement/work_item_tpl',
        'views/create_agreement/tasks_view', 'views/create_agreement/deliverable_preview'
    ],

    function(Backbone, Handlebars, _, Kalendae, autoNumeric, WorkItemTpl, TasksView, DeliverablePreview) {

        'use strict';

        var WorkItemView = Backbone.View.extend({

            tagName: 'div',
            className: 'bottom_divider hide',

            template: WorkItemTpl,

            initialize: function(options) {
                this.router = options.router;
                this.render();
            },

            render: function() {

                var deposit = this.model.isDeposit();
                var tasksView = new TasksView({
                    model: this.model,
                    collection: this.model.get('scopeItems'),
                    deposit: deposit
                });
                tasksView.render();
                var preview = new DeliverablePreview({
                    model: this.model
                });
                var html = $(this.template({
                    model: this.model.toJSON(),
                    deposit: deposit,
                }));
                html.find('.tasks_section').html(tasksView.el);
                this.$el.html(html);
                this.$('.preview_container').html(preview.el);

                this.$el.fadeIn('slow');

                return this;

            },
            events: {
                "blur input": "updateFields",
                "blur .paymentAmount": "updateAmount",
                "blur #require_checkbox": "requireDeposit",
                "focus .kal": "triggerCalender",
                "click .remove_icon > a": "removeModel",
                'focus .currency_format': 'triggerCurrencyFormat',
                'click #require_checkbox': 'showDeposit'
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

            requireDeposit: function(event) {
                if (!event.target.name) return;
                if (event.target.value === 'true') {
                    this.model.set(event.target.name, true);
                }
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

            showDeposit: function(event) {
                $('#deposit').fadeToggle('hide');
            }

        });

        return WorkItemView;

    }
);