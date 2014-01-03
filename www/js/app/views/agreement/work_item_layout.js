define(['backbone', 'handlebars', 'hbs!templates/agreement/work_item_layout', 'underscore', 'marionette', 'views/agreement/work_item_header_view',
   'views/agreement/communication/messages_box', 'views/agreement/work_item_view'],

  function (Backbone, Handlebars, tpl, _, Marionette, WorkItemHeaderview, MessagesBoxView, WorkItemView) {

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
        this.messages = options.messages;
        this.filteredMessages = this.filterMessages();
        this.render();
      },
      onRender: function(){
        this.headerBox.show( new WorkItemHeaderview({model: this.model}));
        this.tasksBox.show(new WorkItemView({model: this.model, collection: this.model.get("scopeItems")}));
        this.messagesBox.show(new MessagesBoxView({collection: this.filteredMessages, user:this.user, otherUser: this.otherUser}));
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