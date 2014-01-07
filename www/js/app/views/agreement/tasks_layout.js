define(['backbone', 'handlebars', 'hbs!templates/agreement/tasks_layout', 'underscore', 'marionette', 'views/agreement/tasks_header_view',
   'views/agreement/communication/messages_box', 'views/agreement/todo_list_view', 'collections/comments'],

  function (Backbone, Handlebars, tpl, _, Marionette, TaskHeaderview, MessagesBoxView, TaskView, MessagesCollection) {

    'use strict';

    var Layout = Backbone.Marionette.Layout.extend({

      template: tpl,

      regions: {
        headerBox: "#work_item_header",
        messagesBox: "#messagesBox-section",
        tasksBox: "#tasks_container"
      },

      initialize: function(options){
        this.user = options.user;
        this.otherUser = options.otherUser;
        this.messages = new MessagesCollection();
        this.filteredMessages = this.filterMessages();
        this.render();
      },
      onRender: function(){
        this.headerBox.show( new TaskHeaderview({model: this.model}));
        this.tasksBox.show(new TaskView({model: this.model, collection: this.model.get("scopeItems")}));
        // this.messagesBox.show(new MessagesBoxView({collection: this.filteredMessages, user:this.user, otherUser: this.otherUser}));
      },

      filterMessages: function() {
        var title = this.model.get("title"),
            filtered;
        if (title) {
          filtered = this.messages;
          filtered = filtered.filterByTagTitle(title);
        }
        return filtered;
      }

    });

return Layout;

}
);