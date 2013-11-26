define(['backbone', 'handlebars', 'underscore', 'marionette','jquery-ui', 'ckeditor', 'ckadapter',
  'text!templates/agreement/discussion_tpl.html', 'views/agreement/comment_view',
  'views/agreement/action_select'],

  function (Backbone, Handlebars, _, Marionette, autocomplete, CKEDITOR, ckadapter, discussionTemplate, CommentView, ActionSelect) {

    'use strict';
    // Prevent the backspace key from navigating back.
    // This should be another plugin and it should be in the whole website.
    $(document).unbind('keydown').bind('keydown', function (event) {
        var doPrevent = false;
        if (event.keyCode === 8) {
            var d = event.srcElement || event.target;
            if ((d.tagName.toUpperCase() === 'INPUT' && (d.type.toUpperCase() === 'TEXT' || d.type.toUpperCase() === 'PASSWORD' || d.type.toUpperCase() === 'FILE')) 
                 || d.tagName.toUpperCase() === 'TEXTAREA') {
                doPrevent = d.readOnly || d.disabled;
            }
            else {
                doPrevent = true;
            }
        }

        if (doPrevent) {
            event.preventDefault();
        }
    });

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
        "keypress .new_tag": "createNewTag",
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

        // This should be siphoned out into a plugin

        (function($){
    
    // jQuery autoGrowInput plugin by James Padolsey
    // See related thread: http://stackoverflow.com/questions/931207/is-there-a-jquery-autogrow-plugin-for-text-fields
        
        $.fn.autoGrowInput = function(o) {
            
                o = $.extend({
                    maxWidth: 1000,
                    minWidth: 0,
                    comfortZone: 70
                }, o);
                
                this.filter('input:text').each(function(){
                    
                    var minWidth = o.minWidth || $(this).width(),
                        val = '',
                        input = $(this),
                        testSubject = $('<tester/>').css({
                            position: 'absolute',
                            top: -9999,
                            left: -9999,
                            width: 'auto',
                            fontSize: input.css('fontSize'),
                            fontFamily: input.css('fontFamily'),
                            fontWeight: input.css('fontWeight'),
                            letterSpacing: input.css('letterSpacing'),
                            whiteSpace: 'nowrap'
                        }),
                        check = function() {
                            
                            if (val === (val = input.val())) {return;}
                            
                            // Enter new content into testSubject
                            var escaped = val.replace(/&/g, '&amp;').replace(/\s/g,'&nbsp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                            testSubject.html(escaped);
                            
                            // Calculate new width + whether to change
                            var testerWidth = testSubject.width(),
                                newWidth = (testerWidth + o.comfortZone) >= minWidth ? testerWidth + o.comfortZone : minWidth,
                                currentWidth = input.width(),
                                isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth)
                                                     || (newWidth > minWidth && newWidth < o.maxWidth);
                            
                            // Animate width
                            if (isValidWidthChange) {
                                input.width(newWidth);
                            }
                            
                        };
                        
                    testSubject.insertAfter(input);
                    
                    $(this).bind('keydown keyup blur update', check);
                    
                });
                
                return this;
            
            };
            
        })(jQuery);

        $('.new_tag').autoGrowInput({
          comfortZone: 3,
          minWidth: 1,
          maxWidth: 200
        });
      }

    });

return DiscussionView;

}
);
