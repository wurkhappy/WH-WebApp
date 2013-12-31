
define(['backbone', 'handlebars', 'underscore', 'marionette',
  'hbs!templates/agreement/work_item_tpl', 'views/agreement/new_scope_item_view'],

  function (Backbone, Handlebars, _, Marionette, WorkItemTemplate, ScopeItemView) {

    'use strict';

    var WorkItemView = Backbone.Marionette.CompositeView.extend({

      template: WorkItemTemplate,
      
      itemView: ScopeItemView,
      itemViewContainer:'.scope_items_container',

      initialize:function(options){
        //this.collection = this.model.get("scopeItems");
        //this.userIsClient = options.userIsClient;
        //this.listenTo(this.model, 'change',this.checkStatus)
          //.get("dateExpected").format("MMM Do YYYY"))

      this.model = options.model;
      this.render();
      },

      events:{
      },

    });

return WorkItemView;

}
);
