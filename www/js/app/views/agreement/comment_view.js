
define(['backbone', 'handlebars', 'text!templates/agreement/comment_tpl.html'],

  function (Backbone, Handlebars, commentTpl) {

    'use strict';

    var CommentView = Backbone.View.extend({

      template: Handlebars.compile(commentTpl),
      className: "hide comment_container",

      initialize:function(options){
        this.agreement = options.agreement;
        this.avatar = options.user.get("avatarURL");
        this.milestone = this.agreement.get("payments").get(this.model.get("milestoneID"));
        this.status = this.agreement.get("statusHistory").get(this.model.get("statusID"));
        this.commentCreatedDate = this.model.get("dateCreated");
        this.firstName = options.user.get("firstName");
        this.lastName = options.user.get("lastName");
        this.userID = options.user.get("id");
        this.messageUserID = this.model.get("userID");
        this.email = options.user.get("email");
        this.otherUserFirstName = options.otherUser.get("firstName");
        this.otherUserLastName = options.otherUser.get("lastName");
        this.otherUserEmail = options.otherUser.get("email");
        this.otherAvatar = options.otherUser.get("avatarURL");
      },

      render: function () {
        var statusTitle,
            dateCreated,
            thisAvatar,
            firstName,
            lastName,
            name,
            isThisUserMessage,
            otherName,
            otherAvatar;
        if (this.status) {
          var prefix = (this.status.get("paymentID")) ? "Payment" : "Agreement"
          statusTitle = prefix + " " +this.status.get("action") + " on " + this.status.get("date").format('MMM D, YYYY');
        }

        if ($(".discussion_placeholder")) {
          var $placeholder = $(".discussion_placeholder");
          $placeholder.remove();
        }

        if (this.commentCreatedDate) {
          dateCreated = this.commentCreatedDate.format('MMMM Do YYYY, h:mm a');
        }

        var isThisUserMessage = (this.userID === this.messageUserID);

        if (this.firstName || this.lastName) {
          name = this.firstName +' '+ this.lastName;
        } else {
          name = this.otherUserEmail;
        }

        if (this.avatar) {
          thisAvatar = this.avatar;
        } else {
          thisAvatar = "/img/default_photo.jpg";
        }

        if (this.otherAvatar) {
          otherAvatar = this.otherAvatar;
        } else {
          otherAvatar = "/img/default_photo.jpg";
        }

        if (this.otherUserFirstName || this.otherUserLastName) {
          otherName = this.otherUserFirstName +' '+ this.otherUserLastName;
        } else {
          otherName = this.email
        }

        var milestoneTitle = (this.milestone) ? this.milestone.get("title") : "";
        this.$el.html(this.template({
          model: this.model.toJSON(),
          milestoneTitle: milestoneTitle,
          statusTitle: statusTitle,
          dateCreated: dateCreated,
          thisAvatar: thisAvatar,
          name: name,
          isThisUserMessage: isThisUserMessage,
          otherName: otherName,
          otherAvatar: otherAvatar
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