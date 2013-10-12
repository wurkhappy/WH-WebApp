define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/agreement/discussion_tpl.html', 'views/agreement/comment_view',
  'views/agreement/action_select'],

  function (Backbone, Handlebars, _, Marionette, discussionTemplate, CommentView, ActionSelect) {

    'use strict';

    var DiscussionView = Backbone.Marionette.CompositeView.extend({

      template: Handlebars.compile(discussionTemplate),

      itemView: CommentView,
      itemViewOptions:function(){
        return {agreement: this.model};
      },
      itemViewContainer:'ul',
      events: {
        "keypress input":"addComment",
        "click .send_comment": "addComment",
        "change #milestoneSelect":"updateMilestone",
        "change #actionSelect":"updateStatus"
      },

      initialize:function(){
        this.userIsClient = window.thisUser.id === this.model.get("clientID");
        this.collection = this.model.get("comments");
      },
      onRender:function(){
        this.actionSelect = new ActionSelect({collection: this.model.get("statusHistory").filterByPaymentID(this.milestone)}).render();
        this.$('#action-select-wrapper').html(this.actionSelect.$el);
        var lastComment = this.collection.at(this.collection.length - 1);
        if(lastComment){
          this.$('#milestoneSelect').val(lastComment.get("milestoneID")).trigger('change');
          this.$('#actionSelect').val(lastComment.get("statusID")).trigger('change');
        }

      },
      addComment: function(event){
        var $text = $('input.enter_comment_input');

        if (event.keyCode == 13 || event.type == "click") {
          var model = new this.collection.model({
            text: $text.val(),
            dateCreated: moment(),
            authorID:window.thisUser.id,
            milestoneID: this.milestone,
            statusID: this.status
          })
          this.collection.add(model);
          model.save();
          $text.val('');
          $text.focus();
        }
      },
      updateMilestone: function(event){
        this.milestone = event.target.value;
        var filtered = this.model.get("statusHistory").filterByPaymentID(this.milestone);
        this.actionSelect.collection = filtered;
        this.actionSelect.render();
      },
      updateStatus: function(event){
        this.status = event.target.value;
      }
    });

return DiscussionView;

}
);
