
define(['backbone', 'handlebars', 'underscore', 'marionette',
  'hbs!templates/agreement/task_item_tpl','hbs!templates/agreement/empty_tasks_tpl', 'views/agreement/task_view'],

  function (Backbone, Handlebars, _, Marionette, tpl, EmptyTemplate, TaskItemView) {

    'use strict';

    var NoItemsView = Backbone.Marionette.ItemView.extend({
      template: EmptyTemplate
    });


    var WorkItemView = Backbone.Marionette.CompositeView.extend({

      template: tpl,
      
      itemView: TaskItemView,
      emptyView: NoItemsView,
      itemViewContainer:'.tasks_container',

      initialize:function(options){
        this.model = options.model;
        this.collection = options.collection;
        this.listenTo(this.collection, "change:completed", this.taskStatusChange);
        this.render();
      },
      taskStatusChange: _.debounce(function(){
        this.collection.update();
      }, 2000)

    });

return WorkItemView;

}
);