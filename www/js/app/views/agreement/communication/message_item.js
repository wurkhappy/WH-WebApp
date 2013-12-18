
define(['backbone', 'handlebars', 'hbs!templates/agreement/communication/message_item'],

  function (Backbone, Handlebars, messageItemTpl) {

    'use strict';

    var CommentView = Backbone.View.extend({

      template: messageItemTpl,
      className: "hide comment_container",

      initialize: function(options){
        this.user = options.user;
        this.otherUser = options.otherUser;
      },

      render: function () {
        if (this.$(".discussion_placeholder")) {
          var $placeholder = this.$(".discussion_placeholder");
          $placeholder.remove();
        }

        var dateCreated = this.model.get("dateCreated").format('MMMM Do YYYY, h:mm a');

        var isThisUserMessage = (this.user.get("id") === this.model.get("userID"));

        var name;
        if (this.user.get("firstName")) {
          name = this.user.get("firstName") +' '+ this.user.get("lastName");
        } else {
          name = this.user.get("email");
        }

        var otherName;
        if (this.otherUser.get("firstName")) {
          otherName = this.otherUser.get("firstName") +' '+ this.otherUser.get("lastName");
        } else {
          otherName = this.otherUser.get("email");
        }

        var milestoneTitle = (this.milestone) ? this.milestone.get("title") : "";
        this.$el.html(this.template({
          model: this.model.toJSON(),
          dateCreated: dateCreated,
          name: name,
          isThisUserMessage: isThisUserMessage,
          otherName: otherName,
        }));


        this.fadeIn(this.$el);


        return this;

      },

      fadeIn: function (that) {
        _.defer( function () {
          that.fadeIn();
        });
      }

    });

return CommentView;

}
);