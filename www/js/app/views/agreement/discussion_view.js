define(['backbone', 'handlebars', 'underscore', 'marionette','jquery-ui', 'ckeditor', 'ckadapter',
  'text!templates/agreement/discussion_tpl.html', 'views/agreement/comment_view',
  'views/agreement/action_select', 'plugins/preventBackSpaceDefault', 'auto-grow'],

  function (Backbone, Handlebars, _, Marionette, autocomplete, CKEDITOR, ckadapter, discussionTemplate, CommentView, ActionSelect, preventBackSpaceDefault, autoGrow) {

    'use strict';
    preventBackSpaceDefault();
    

    var DiscussionView = Backbone.Marionette.CompositeView.extend({

      template: Handlebars.compile(discussionTemplate),

      itemView: CommentView,
      itemViewOptions:function(options){
        return {agreement: this.model, user: this.user, otherUser: this.otherUser};
      },
      itemViewContainer:'ul',
      events: {
        "keypress input":"addComment",
        "click .send_comment": "addComment",
        "change #milestoneSelect":"updateMilestone",
        "change #actionSelect":"updateStatus",
        "focus select": "addSelectActive",
        "blur select": "removeSelectActive",
        "change select": "updateSelect",
        "click .tag_filter": "toggleFilterActive",
        "click .added_tag": "toggleTagActive",
        "keyup .added_tag": "removeTag",
        "focus .new_tag": "triggerAutoComplete",
        "keydown .new_tag": "createNewTag",
        "click .add_tag": "showTagInput"
      },

      initialize:function(options){
        this.userIsClient = window.thisUser.id === this.model.get("clientID");
        this.collection = this.model.get("comments");
        this.user = options.user;
        this.otherUser = options.otherUser;

      },
      onRender:function(){
        this.actionSelect = new ActionSelect({collection: this.model.get("statusHistory").filterByPaymentID(this.milestone)}).render();
        this.$('#action-select-wrapper').html(this.actionSelect.$el);
        var lastComment = this.collection.at(this.collection.length - 1);
        if(lastComment){
          this.$('#milestoneSelect').val(lastComment.get("milestoneID")).trigger('change');
          this.$('#actionSelect').val(lastComment.get("statusID")).trigger('change');
        }

        _.defer(function(that) {
          CKEDITOR.replace('message_editor', {
            toolbar: [
            {items: ['Bold','-', 'Italic', '-', 'Underline']}
            ],
            disableNativeSpellChecker: false,
            skin: 'wurkhappy'
          });
        });
        
      },

      addComment: function(event){
        var editor = CKEDITOR.instances.message_editor;
        var html = editor.getData();

        if (event.type == "click") {
          var model = new this.collection.model({
            text: html,
            dateCreated: moment(),
            userID:window.thisUser.id,
            milestoneID: this.milestone,
            statusID: this.status,
            agreementVersionID: this.collection.agreement.get("versionID"),
          })
          this.collection.add(model);
          model.save();

          editor.setData('');

          $(".notification_container").last().fadeIn("slow").fadeOut(2000);

          _.defer( function() {
            $(".discussion_container").scrollTop($(".discussion_container")[0].scrollHeight);
          });

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
      },

      updateSelect: function (event) {

          var $select = $(event.target);
          var str = $select.find(":selected").text(); 
          $select.parent().find(".out").text(str);
          //.find(".out").text(str) 
      },

      addSelectActive: function (event) {
        var $fakeSelect = $(event.target.parentNode);
        $fakeSelect.addClass('active_select')
      },

      removeSelectActive: function (event) {
        var $fakeSelect = $(event.target.parentNode);
        $fakeSelect.removeClass('active_select')
      },

      toggleFilterActive: function(event) {
        $(event.currentTarget).toggleClass("tag_filter_active");
      },

      toggleTagActive: function(event) {
        $(".added_tag").removeClass("tag_active");

        var $elem = $(event.currentTarget);
          $elem.toggleClass("tag_active");
          $elem.focus();
      },

      removeTag: function(event) {
        event.preventDefault();
        event.stopPropagation();

        var $elem = $(event.currentTarget);

        if (event.keyCode === 8) {
          $elem.remove();
        }
      },

      createNewTag: function(event) {

        var $elem = $(event.currentTarget);

        if (event.keyCode === 9) {
          event.preventDefault();
        }

        if ($elem.val() === '') {return};

        if (event.keyCode === 13 || event.keyCode === 9) {
          var beg = '<div class="inline added_tag new_added_tag" tabindex="-1">'
          var end = '</div>'
          var htmlString = beg + $elem.val() + end;

          $(htmlString).appendTo(".enter_tags_sub_container");
          $elem.val('');
          $elem.hide();
        }
      },

      showTagInput: function(event) {
        var $input = $(".new_tag");
        $input.show();
        $input.focus();

      },

      triggerAutoComplete: function(event) {
        var availableTags = [
          "writing",
          "wireframes",
          "2nd payment",
          "update",
          "product page",
          "footer",
          "header",
          "waffle",
          "candy"
        ];

        $(".new_tag").autocomplete({
          source: availableTags
        });

        this.triggerAutoGrow();
      },

      triggerAutoGrow: function(event) {

        $('.new_tag').autoGrow({
          comfortZone: 3
        });
      }

    });

return DiscussionView;

}
);
