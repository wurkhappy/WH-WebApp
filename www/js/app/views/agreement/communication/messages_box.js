/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'marionette',
  'hbs!templates/agreement/communication/messages_box', 'views/agreement/communication/message_item', 'hbs!templates/agreement/communication/messages_box_empty'],

  function (Backbone, Handlebars, _, Marionette, tpl, MessageItem, emptyTpl) {

    // 'use strict';
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

        //not sure why this isn't called anyway since a reset should retrigger this.render()
        this.listenTo(this.collection, "reset", this.onRender);
      },
      onRender: function(){
        setTimeout(_.bind(function(){
          //MP: I hate doing stuff like this (arbitrary waiting) but we can't ask to scroll until all children have been rendered
          this.$el[0].scrollTop = this.$el[0].scrollHeight;
        }, this), 55);
      },

    });

    return MessageBox;

  }
  );