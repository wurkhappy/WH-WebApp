
define(['backbone', 'handlebars', 'text!templates/agreement/comment_tpl.html'],

  function (Backbone, Handlebars, commentTpl) {

    'use strict';

    var CommentView = Backbone.View.extend({

      template: Handlebars.compile(commentTpl),

      initialize:function(options){
        this.agreement = options.agreement;
        this.avatar = options.user.get("avatarURL");
        this.milestone = this.agreement.get("payments").get(this.model.get("milestoneID"));
        this.status = this.agreement.get("statusHistory").get(this.model.get("statusID"));
        this.commentCreatedDate = this.model.get("dateCreated");

      },

      render: function () {
        var statusTitle,
            dateCreated,
            thisAvatar;
        if (this.status) {
          var prefix = (this.status.get("paymentID")) ? "Payment" : "Agreement"
          statusTitle = prefix + " " +this.status.get("action") + " on " + this.status.get("date").format('MMM D, YYYY');
        }

        if (this.commentCreatedDate) {
          dateCreated = this.commentCreatedDate.format('MMMM Do YYYY, h:mm:ss a');
        }



        if (this.avatar) {
          console.log("this user has an avatar");
          thisAvatar = this.avatar;
        } else {
          thisAvatar = "../img/default_photo.jpg";
        }

        /*if (this.status) {
          dateCreated = this.status.get("date").format('MMM D, YYYY');
        }
*/

        var milestoneTitle = (this.milestone) ? this.milestone.get("title") : "";
        this.$el.html(this.template({
          model: this.model.toJSON(),
          milestoneTitle: milestoneTitle,
          statusTitle: statusTitle,
          dateCreated: dateCreated,
          thisAvatar: thisAvatar
        }));
        return this;

      }

    });

    return CommentView;

  }
  );