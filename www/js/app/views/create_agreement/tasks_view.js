/*
 * Tasks View - in Create Agreement.
 * Composite view for tasks that belong to a work item.
 */

define(['backbone', 'handlebars', 'underscore', 'marionette',
        'hbs!templates/create_agreement/tasks_tpl', 'views/create_agreement/task_view'
    ],

    function(Backbone, Handlebars, _, Marionette, TasksTpl, TaskView) {

        'use strict';

        var WorkScopeView = Backbone.Marionette.CompositeView.extend({

            className: 'scopeWrapper',

            template: TasksTpl,

            itemView: TaskView,
            itemViewContainer: 'ul',

            initialize: function(options) {
                this.deposit = options.deposit;
                this.scopeItems = this.collection.toJSON();
                this.render();
            },

            render: function() {
                var deposit = this.deposit;
                var scopeItems = this.scopeItems;
                var collection = this.collection.models;
                var that = this;

                this.$el.html(this.template({
                    deposit: deposit,
                    collection: this.collection
                }));

                // iterate through collection and append existing scope items to milestone
                _.each(collection, function(element, index, list) {
                    var taskView = new TaskView({
                        collection: element,
                    });
                    that.$('.create_scope_item_container').append(taskView.render().el);
                });

            },

            events: {
                "keypress input": "addOnEnter",
                "click .add_comment": "addScopeItem",
                "focus input": "fadeError",
                "click .item_delete": "removeItem"
            },

            addOnEnter: function(event) {
                if (event.keyCode == 13) {
                    this.collection.add({
                        title: event.target.value
                    });
                    event.target.value = null;
                }
            },


            addScopeItem: function(event) {
                event.preventDefault();
                var $text = $(event.target).prev('.add_work_item_input'),
                    $input = $('input'),
                    $error = $(event.target).next('.add_work_item_error');

                    console.log($text.val());

                if ($text.val() === '') {
                    $error.fadeIn('slow');
                    $input.keypress(function() {
                        $('.add_work_item_error').fadeOut('slow');
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

            removeItem: function(event) {
                event.preventDefault();
                this.model.collection.remove(this.model);
            },

            fadeError: function(event) {
                $('.add_work_item_error').fadeOut('fast');
            }

        });

        return WorkScopeView;

    }
);