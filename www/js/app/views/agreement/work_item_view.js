
define(['backbone', 'handlebars', 'underscore', 'marionette',
  'hbs!templates/agreement/work_item_tpl','hbs!templates/agreement/empty_tasks_tpl', 'views/agreement/task_view'],

  function (Backbone, Handlebars, _, Marionette, WorkItemTemplate, EmptyTemplate, TaskItemView) {

    'use strict';

    var NoItemsView = Backbone.Marionette.ItemView.extend({
      template: EmptyTemplate
    });


    var WorkItemView = Backbone.Marionette.CompositeView.extend({

      template: WorkItemTemplate,
      
      itemView: TaskItemView,
      emptyView: NoItemsView,
      itemViewContainer:'.tasks_container',

      initialize:function(options){
        this.model = options.model;
        this.collection = options.collection;
        this.render();
      },

      events:{
        "click .checkbox": "toggleCheckbox"
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
