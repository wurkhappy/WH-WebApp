
define(['backbone', 'handlebars', 'hbs!templates/agreement/task_tpl'],

  function (Backbone, Handlebars, taskTpl) {

    'use strict';

    var TaskView = Backbone.View.extend({

      template: taskTpl,
      className: "check_item",

      initialize: function() {
        console.log("something")
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