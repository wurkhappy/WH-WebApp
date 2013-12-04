define(['backbone', 'handlebars', 'underscore', 'marionette','jquery-ui', 'ckeditor', 'ckadapter',
  'hbs!templates/agreement/communication/new_message_box',
  'plugins/preventBackSpaceDefault', 'auto-grow', 'models/comment', 'views/agreement/communication/comment_tags'],

  function (Backbone, Handlebars, _, Marionette, autocomplete, CKEDITOR, ckadapter, discussionTemplate,
    preventBackSpaceDefault, autoGrow, CommentModel, CommentTagsView) {

    'use strict';
    preventBackSpaceDefault();
    

    var NewMessageBox = Backbone.View.extend({

      template: discussionTemplate,

      events: {
        "keypress input":"addComment",
        "click .send_comment": "addComment",
        "focus select": "addSelectActive",
        "blur select": "removeSelectActive"
      },

      initialize:function(options){
        this.user = options.user;
        this.tags = options.tags;

        //build comment model with the tags from the last comment
        var tags = (options.lastMessage) ? options.lastMessage.get("tags").toJSON() : null;
        this.model = new CommentModel({
          userID:this.user.id,
          tags: tags
        })
      },
      render: function () {
        this.$el.html(this.template({}));
        setTimeout(_.bind(this.onRender, this),5);
        return this;

      },
      onRender:function(){
        CKEDITOR.replace('message_editor', {
          toolbar: [
          {items: ['Bold','-', 'Italic', '-', 'Underline']}
          ],
          disableNativeSpellChecker: false,
          skin: 'wurkhappy,https://d3kq8dzp7eezz0.cloudfront.net/css-1/wurkhappy/'
        });
        var commentTagsView = new CommentTagsView({collection: this.model.get("tags"), tags: this.tags});
        commentTagsView.render();
        this.$('#comment-tags').html(commentTagsView.el);   
      },

      addComment: function(event){
        var editor = CKEDITOR.instances.message_editor;
        var html = editor.getData();

        if (event.type == "click") {
          this.model.set("dateCreated", moment());
          this.model.set("text", html);
          this.trigger("commentAdded", this.model);
          this.model.save(null, {success: _.bind(function(model, response){
            var tags = model.get("tags");
            this.tags.addTags(tags.toJSON());
            this.model.get("tags").reset(tags.toJSON());
            this.model.unset("id");
            this.model.unset("dateCreated");
          }, this)});

          editor.setData('');

          $(".notification_container").last().fadeIn("slow").fadeOut(2000);

          _.defer( function() {
            $(".discussion_container").scrollTop($(".discussion_container")[0].scrollHeight);
          });

        }
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
        }

      });

return NewMessageBox;

}
);
