/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'marionette',
  'hbs!templates/agreement/communication/messages_box', 'views/agreement/communication/message_item', 'hbs!templates/agreement/communication/messages_box_empty'],

  function (Backbone, Handlebars, _, Marionette, tpl, MessageItem, emptyTpl) {

    'use strict';
    var EmptyView = Backbone.Marionette.ItemView.extend({
      template: emptyTpl
    });

    var MessageBox = Backbone.Marionette.CompositeView.extend({

      template: tpl,
      className: "discussion_container float_left",
      tagName: "ul",

      itemView: MessageItem,
      emptyView: EmptyView,
      itemViewOptions:function(options){
        return {user: this.user, otherUser: this.otherUser};
      },
      initialize: function(options){
        this.user = options.user;
        this.otherUser = options.otherUser;
        console.log(this.collection);
      }
    });

    return MessageBox;

  }
  );