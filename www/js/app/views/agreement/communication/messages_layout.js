define(['backbone', 'handlebars', 'hbs!templates/agreement/communication/messages_layout', 'underscore', 'marionette',
  'views/agreement/communication/filters_box', 'views/agreement/communication/messages_box'],

  function (Backbone, Handlebars, tpl, _, Marionette, FilterBox, MessagesBox) {

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
      },
      onRender: function(){
        var filterBox = new FilterBox({collection: this.tags});
        this.listenTo(filterBox, "itemview:tag_selected", this.addFilter);
        this.filters.show(filterBox);
        this.messagesBox.show(new MessagesBox({collection: this.messages, user:this.user, otherUser: this.otherUser}))
      },
      addFilter: function(tag){
      }
    });

    return Layout;

  }
  );