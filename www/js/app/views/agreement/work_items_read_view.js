define(['backbone', 'handlebars', 'underscore', 'marionette',
  'hbs!templates/agreement/work_items_read_tpl', 'views/agreement/work_item_view'],

  function (Backbone, Handlebars, _, Marionette, tpl, WorkItemView) {

    'use strict';

    var WorkItemsReadView = Backbone.Marionette.CompositeView.extend({

      template: tpl,

      itemView: WorkItemView,
      itemViewContainer:'ul',
      itemViewOptions: function(){
        return {user: this.user, otherUser: this.otherUser, messages: this.messages};
      },
      initialize: function(options){
        this.user = options.user;
        this.otherUser = options.otherUser;
        this.messages = options.messages;
      },
      onRender:function(){
        this.$('#payments-total').text('$'+this.collection.getTotalAmount());
      }
    });

    return WorkItemsReadView;

  }
  );