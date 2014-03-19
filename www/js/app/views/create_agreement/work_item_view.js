/* 
 * Work Item View - Create Agreement View.
 * One unit of work (the same as a service). This is the item view.
 *
 */

define(['backbone', 'handlebars', 'underscore', 'kalendae',
        'hbs!templates/create_agreement/work_item_tpl', 'views/create_agreement/tasks_view'
    ],

    function(Backbone, Handlebars, _, Kalendae, WorkItemTpl, TasksView) {

        'use strict';

        var WorkItemView = Backbone.View.extend({

            tagName: 'div',

            template: WorkItemTpl,

            initialize: function(options) {
                this.router = options.router;
                this.render();
            },

            render: function() {

                var tasksView = new TasksView({
                    model: this.model,
                    collection: this.model.get('scopeItems'),
                });
                tasksView.render();

                var html = $(this.template({
                    model: this.model.toJSON(),
                }));
                html.find('.tasks_section').html(tasksView.el);
                this.$el.html(html);

                this.$el.fadeIn('slow');

                return this;

            },
            events: {
                "blur input": "updateFields",
                "focus .kal": "triggerCalender",
                "click #removeService": "removeModel"
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
            }

        });

        return WorkItemView;

    }
);