
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

      initialize: function() {
        this.render();
      },

      render: function () {
        this.$el.html(this.template(this.model.toJSON()));

        return this;

      }

    });

    return TaskView;

  }
  );