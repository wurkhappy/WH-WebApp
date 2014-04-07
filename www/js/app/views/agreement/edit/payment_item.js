define(['backbone', 'handlebars', 'hbs!templates/agreement/edit/payment_item'],

    function(Backbone, Handlebars, tpl) {

        'use strict';

        var ScopeItemView = Backbone.View.extend({

            template: tpl,

            render: function() {
                this.$el.html(this.template(this.model.toJSON()));

                return this;

            },
            events: {
                "click a": "removeItem",
                "focus .kal": "triggerCalender",
                "blur input": "updateFields"
            },
            removeItem: function(event) {
                event.preventDefault();
                this.model.collection.remove(this.model);
            },
            triggerCalender: function(event) {
                if (!this.calendar) {
                    this.calendar = new Kalendae.Input(this.$(".kal")[0], {});
                    this.calendar.subscribe('date-clicked', _.bind(this.setDate, this));
                }
            },
            setDate: function(date, action) {
                this.model.set("dateExpected", date);

                _.delay(this.closeCalendar, 150);
                this.$('.kal').val(date.format('MM/DD/YYYY'));
                this.$('.kal').blur();

            },
            closeCalendar: function() {
                $('.kalendae').hide();
            },
            updateFields: function(event) {
                this.model.set(event.target.name, event.target.value);
            }

        });

        return ScopeItemView;

    }
);