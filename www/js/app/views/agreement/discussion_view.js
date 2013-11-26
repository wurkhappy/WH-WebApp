define(['backbone', 'handlebars', 'underscore', 'marionette','jquery-ui',
  'text!templates/agreement/discussion_tpl.html', 'views/agreement/comment_view',
  'views/agreement/action_select'],

  function (Backbone, Handlebars, _, Marionette, autocomplete, discussionTemplate, CommentView, ActionSelect) {

    'use strict';

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
        "keypress .added_tag": "removeTag",
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

      },
      addComment: function(event){
        var $text = $('textarea.enter_comment_input');

        if (event.type == "click") {
          var model = new this.collection.model({
            text: $text.val(),
            dateCreated: moment(),
            userID:window.thisUser.id,
            milestoneID: this.milestone,
            statusID: this.status,
            agreementVersionID: this.collection.agreement.get("versionID"),
          })
          this.collection.add(model);
          model.save();
          $text.val('');
          $text.focus();

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
        var $elem = $(event.currentTarget);
          $elem.toggleClass("tag_active");
          $elem.focus();
      },

      removeTag: function(event) {
        event.preventDefault();
        console.log(event.currentTarget);
        if (event.keycode === 8) {
          console.log(event.currentTarget);
        }
      },

      createNewTag: function(event) {
        var $elem = $(event.currentTarget);

        if (event.keyCode === 13 || event.keyCode === 9) {
          var beg = '<div class="inline added_tag new_added_tag">'
          var end = '</div>'
          var htmlString = beg + $elem.val() + end;


          $(htmlString).appendTo(".enter_tags_sub_container");
          $elem.val('');
          $elem.hide();
        }
      },

      showTagInput: function(event) {
        $(".new_tag").show();
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
                    
                    $(this).bind('keyup keydown blur update', check);
                    
                });
                
                return this;
            
            };
            
        })(jQuery);

        $('.new_tag').autoGrowInput({
          comfortZone: 10,
          minWidth: 1,
          maxWidth: 200
        });
      }

    });

return DiscussionView;

}
);
