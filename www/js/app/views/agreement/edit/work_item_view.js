define(['backbone', 'handlebars', 'underscore', 'marionette', 'kalendae',
        'hbs!templates/agreement/edit/work_item_tpl', 'views/agreement/edit/scope_item_view', 'views/agreement/task_view'
    ],

    function(Backbone, Handlebars, _, Marionette, Kalendae, paymentItemTemplate, ScopeItemView, TaskPaidView) {

        'use strict';

        var WorkItemEditView = Backbone.Marionette.CompositeView.extend({

            template: paymentItemTemplate,

            itemView: ScopeItemView,
            itemViewContainer: '.scope_items_container',

            initialize: function() {
                this.collection = this.model.get("scopeItems");
            },
            events: {
                "blur .amount": "updateAmount",
                "blur .title": "updateTitle",
                "click #remove_icon": "removeMilestone",
                "keypress .edit_work_item": "addScopeItem",
                "click .add_comment": "addTask",
                "focus .kal": "triggerCalender",
                "focus input": "fadeError"
            },
            getItemView: function(item) {
                if (item.isPaid()) return TaskPaidView;
                return ScopeItemView;
            },
            updateAmount: function(event) {
                var amount = event.target.value;
                var adjAmount = (amount.substring(0, 1) === '$') ? amount.substring(1) : amount;
                this.model.set("amountDue", adjAmount);
            },
            updateTitle: function(event) {
                this.model.set("title", event.target.value)
            },
            removeMilestone: function() {
                this.model.collection.remove(this.model);
            },
            addScopeItem: function(event) {
                if (event.keyCode == 13) {
                    this.collection.add({
                        title: event.target.value
                    });
                    event.target.value = null;
                }
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
            addTask: function(event) {
                var $text = $(event.target).prev('.add_work_item_input'),
                    $input = $('input'),
                    $error = $(event.target).next('.add_work_item_error');

                if ($text.val() === '') {
                    $error.fadeIn('fast');
                    $input.keypress(function() {
                        $('.add_work_item_error').fadeOut('fast');
                    });
                    $text.focus();

                } else {
                    this.collection.add({
                        title: $text.val()
                    });
                    $text.val(null);
                    $text.focus();
                }
            },
            fadeError: function(event) {
                $('.add_work_item_error').fadeOut('fast');
            }

        });

        return WorkItemEditView;

    }
);