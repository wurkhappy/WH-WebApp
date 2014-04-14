define(['backbone', 'marionette', 'handlebars', 'hbs!templates/agreement/task_tpl', 'hbs!templates/agreement/empty_tasks_tpl'],

    function(Backbone, Marionette, Handlebars, taskTpl, EmptyTemplate) {

        'use strict';

        var NoItemsView = Backbone.Marionette.ItemView.extend({
            template: EmptyTemplate,
        });

        var TaskView = Backbone.View.extend({

            template: taskTpl,
            emptyView: NoItemsView,
            className: "check_item",
            events: {
                "click .checkbox": "toggleCheckbox"
            },
            initialize: function() {
                this.render();
            },

            render: function() {
                var completed = (this.model.get("lastAction")) ? this.model.get("lastAction").get("name") === "completed" || this.model.get("lastAction").get("name") === "paid" : false;
                this.$el.html(this.template(_.extend(this.model.toJSON(), {
                    completed: completed
                })));

                return this;

            },
            toggleCheckbox: function(event) {
                event.stopPropagation();
                if (this.model.get("isPaid")) {
                    return;
                }
                var $checkbox = $(event.target),
                    $text = $(event.target).siblings('.task');

                $checkbox.toggleClass("checkbox_complete");
                $text.toggleClass("task_complete");
                if (this.model.get("lastAction") && this.model.get("lastAction").get("name") === "completed") {
                    this.model.set("lastAction", null);
                } else {
                    this.model.setAsCompleteForUser(window.thisUser.id);
                }
                this.model.collection.trigger("completed")
            }

        });

        return TaskView;

    }
);