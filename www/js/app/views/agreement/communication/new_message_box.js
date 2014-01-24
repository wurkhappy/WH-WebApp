define(['backbone', 'handlebars', 'underscore', 'marionette', 'jquery-ui', 'ckeditor', 'ckadapter', 'toastr',
        'hbs!templates/agreement/communication/new_message_box',
        'plugins/preventBackSpaceDefault', 'auto-grow', 'models/comment', 'views/agreement/communication/comment_tags'
    ],

    function(Backbone, Handlebars, _, Marionette, autocomplete, CKEDITOR, ckadapter, toastr, discussionTemplate,
        preventBackSpaceDefault, autoGrow, CommentModel, CommentTagsView) {

        // 'use strict';
        preventBackSpaceDefault();


        var NewMessageBox = Backbone.View.extend({

            template: discussionTemplate,

            events: {
                "click .send_comment": "debounceAddComment",
                "focus select": "addSelectActive",
                "blur select": "removeSelectActive"
            },

            initialize: function(options) {
                this.user = options.user;
                this.tags = options.tags;
                this.messageTags = options.messageTags

                //build comment model with the tags from the last comment
                this.model = new CommentModel({
                    userID: this.user.id,
                    tags: this.messageTags,
                    agreementVersionID: window.VersionID,
                    agreementID: window.agreementID
                });
            },
            render: function() {
                this.$el.html(this.template({}));
                setTimeout(_.bind(this.onRender, this), 5);
                return this;

            },
            onRender: function() {
                CKEDITOR.basePath = 'https://d3kq8dzp7eezz0.cloudfront.net/css/ckeditor/';
                this.editor = this.$('#message_editor').ckeditor({
                    toolbar: [{
                        items: ['Bold', '-', 'Italic', '-', 'Underline', 'BulletedList']
                    }],
                    disableNativeSpellChecker: false,
                    language: 'https://d3kq8dzp7eezz0.cloudfront.net/css-1/en.js',
                    skin: 'wurkhappy,https://d3kq8dzp7eezz0.cloudfront.net/css-1/wurkhappy/',
                    customConfig: 'https://d3kq8dzp7eezz0.cloudfront.net/css-1/config.js'
                }).ckeditorGet();
                CKEDITOR.config.contentsCss = 'https://d3kq8dzp7eezz0.cloudfront.net/css/contents.css';
                CKEDITOR.config.stylesSet = 'my_styles:https://d3kq8dzp7eezz0.cloudfront.net/css-1/styles.js';
                var commentTagsView = new CommentTagsView({
                    collection: this.model.get("tags"),
                    tags: this.tags
                });
                commentTagsView.render();
                this.$('#comment-tags').html(commentTagsView.el);
            },

            debounceAddComment: function(event) {
                event.preventDefault();
                event.stopPropagation();
                this.addComment(event);

            },

            addComment: _.debounce(function(event) {

                var html = this.editor.getData();

                if (event.type == "click") {
                    this.model.set("dateCreated", moment());
                    this.model.set("text", html);
                    this.trigger("commentAdded", this.model);
                    this.model.save(null, {
                        success: _.bind(function(model, response) {
                            var tags = model.get("tags");
                            var modelTags = this.model.get("tags");
                            modelTags.reset(tags.toJSON());
                            this.tags.addTags(tags.toJSON());
                            this.model = new CommentModel({
                                userID: this.user.id,
                                tags: modelTags
                            })
                        }, this)
                    });

                    this.editor.setData('');
                    toastr.success('Message Sent');
                    if (window.production) {
                        analytics.track('New Message Sent');
                    }
                    this.trigger("commentSaved");

                    _.defer(function() {
                        $(".discussion_container").scrollTop($(".discussion_container")[0].scrollHeight);
                    });

                }
            }, 500, true),

            updateSelect: function(event) {

                var $select = $(event.target);
                var str = $select.find(":selected").text();
                $select.parent().find(".out").text(str);
                //.find(".out").text(str) 
            },

            addSelectActive: function(event) {
                var $fakeSelect = $(event.target.parentNode);
                $fakeSelect.addClass('active_select')
            },

            removeSelectActive: function(event) {
                var $fakeSelect = $(event.target.parentNode);
                $fakeSelect.removeClass('active_select')
            }

        });

        return NewMessageBox;

    }
);