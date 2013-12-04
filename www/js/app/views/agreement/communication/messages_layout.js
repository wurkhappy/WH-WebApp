define(['backbone', 'handlebars', 'hbs!templates/agreement/communication/messages_layout', 'underscore', 'marionette',
  'views/agreement/communication/filters_box', 'views/agreement/communication/messages_box', 'collections/tags'],

  function (Backbone, Handlebars, tpl, _, Marionette, FilterBox, MessagesBox, TagCollection) {

    'use strict';

    var Layout = Backbone.Marionette.Layout.extend({
      template: tpl,

      regions: {
        messagesBox: "#messagesBox-section",
        filters: "#tags-section"
      },

      initialize: function(options){
        this.tags = options.tags;
        this.user = options.user;
        this.otherUser = options.otherUser;
        this.messages = options.messages;
        this.displayedMessages = this.messages.clone();
        this.selectedTags = new TagCollection();
      },
      onRender: function(){
        var filterBox = new FilterBox({collection: this.tags});
        this.listenTo(filterBox, "itemview:tag_selected", this.addFilter);
        this.filters.show(filterBox);
        this.messagesBox.show(new MessagesBox({collection: this.displayedMessages, user:this.user, otherUser: this.otherUser}))
      },
      addFilter: function(view, tag){
        var filtered;
        var id = tag.id || tag.cid
        var t = this.selectedTags.get(id);
        if (t) {
          //let's check if selected tags has the model.
          //if it does then we need to remove it and refilter the original messages
          this.selectedTags.remove(t);
          filtered = this.messages;
          this.selectedTags.each(function(model){
            filtered = filtered.filterByTagID(model.id);
          });
        } else {
          //if there is no model in selectedTags then it's a new filter
          //we can take the current messages and filter them
          this.selectedTags.add(tag);
          filtered = this.displayedMessages.filterByTagID(tag.id);
        }
        this.displayedMessages.reset(filtered.models);
      }
    });

return Layout;

}
);