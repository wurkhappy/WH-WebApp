
define(['backbone', 'handlebars', 'hbs!templates/agreement/task_tpl', 'hbs!templates/agreement/empty_tasks_tpl'],

  function (Backbone, Handlebars, taskTpl, EmptyTemplate) {

    'use strict';

    var NoItemsView = Backbone.Marionette.ItemView.extend({
      template: EmptyTemplate,
    });

    var TaskView = Backbone.View.extend({

      template: taskTpl,
      emptyView: NoItemsView,
      className: "check_item",
      events:{
        "click .checkbox": "toggleCheckbox"
      },
      initialize: function() {
        this.render();
      },

      render: function () {
        this.$el.html(this.template(this.model.toJSON()));

        return this;

      },
      toggleCheckbox: function(event) {
        var $checkbox = $(event.target),
        $text = $(event.target).siblings('.task');

        $checkbox.toggleClass("checkbox_complete");
        $text.toggleClass("task_complete");
      }

    });

    return TaskView;

  }
  );