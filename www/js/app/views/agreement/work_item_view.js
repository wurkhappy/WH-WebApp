
define(['backbone', 'handlebars', 'underscore', 'marionette',
  'hbs!templates/agreement/work_item_tpl', 'views/agreement/task_view'],

  function (Backbone, Handlebars, _, Marionette, WorkItemTemplate, TaskView) {

    'use strict';

    var WorkItemView = Backbone.Marionette.CompositeView.extend({

      template: WorkItemTemplate,
      
      itemView: TaskView,
      itemViewContainer:'.tasks_container',

      initialize:function(options){
        //this.collection = this.model.get("scopeItems");
        //this.userIsClient = options.userIsClient;
        //this.listenTo(this.model, 'change',this.checkStatus)
          //.get("dateExpected").format("MMM Do YYYY"))

      this.model = options.model;
      this.collection = options.collection;
      this.render();
      },

      events:{
        "click .js_add_task": "addTask",
        "keypress .new_task": "addTaskOnEnter",
        "click .show_task_input":"showTaskInput",
        "click .checkbox": "toggleCheckbox"
      },

      addTaskOnEnter: function(event) {
        if (event.keyCode == 13) {
          event.preventDefault();
          this.collection.add({text:event.target.value});
          event.target.value = null;
        }

      },

      addTask: function(event) {
        event.preventDefault();

        var $text = $(event.target).parent().prev('.new_task');

        if ($text !== '') {
          this.collection.add({text:$text.val()});
          $text.val(null);
          $text.focus();
        }

      },

      toggleCheckbox: function(event) {
        var $checkbox = $(event.target),
            $text = $(event.target).siblings('.task');

        $checkbox.toggleClass("checkbox_complete");
        $text.toggleClass("task_complete");
      }

    });

return WorkItemView;

}
);
