define(['backbone', 'handlebars', 'hbs!templates/agreement/communication/communication_layout', 'underscore', 'marionette',
  'views/agreement/communication/messages_layout', 'views/agreement/communication/new_message_box'],

  function (Backbone, Handlebars, tpl, _, Marionette, MessagesLayout, NewMessages) {

    'use strict';

    var Layout = Backbone.Marionette.Layout.extend({
      template: tpl,

      regions: {
        messagesSection: "#messages-section",
        newMessage: "#newMessages-section"
      },

      initialize: function(options){
        this.tags = options.tags;
        this.messages = options.messages;
        this.user = options.user;
        this.otherUser = options.otherUser;
      },
      onRender:function(){
        this.messagesSection.show(new MessagesLayout({tags: this.tags, messages: this.messages, user: this.user, otherUser: this.otherUser}));
        var newMessagesView = new NewMessages({tags: this.tags, lastMessage: this.messages.at(this.messages.length - 1), user: this.user, otherUser: this.otherUser});
        this.listenTo(newMessagesView, "commentAdded", this.commentAdded);
        this.newMessage.show(newMessagesView);
      },
      commentAdded: function(comment){
        this.trigger("commentAdded", comment);
      }
    });

    return Layout;

  }
  );