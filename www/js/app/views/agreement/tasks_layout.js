define(['backbone', 'handlebars', 'hbs!templates/agreement/tasks_layout', 'underscore', 'marionette', 'views/agreement/tasks_header_view',
        'views/agreement/communication/messages_box', 'views/agreement/todo_list_view', 'collections/comments', 'ckeditor', 'views/agreement/communication/new_message_box'
    ],

    function(Backbone, Handlebars, tpl, _, Marionette, TaskHeaderview, MessagesBoxView, TaskView, MessagesCollection, CKEDITOR, NewMessages) {

        'use strict';

        var Layout = Backbone.Marionette.Layout.extend({

            template: tpl,

            regions: {
                headerBox: "#work_item_header",
                messagesBox: "#work-item-messages",
                tasksBox: "#tasks_container",
                newMessage: "#new_comment_text",
            },
            events: {
                "click #add_workitem_comment": "showNewMessage",
                "click #hide_workitem_comment": "hideNewMessage"
            },
            initialize: function(options) {
                this.user = options.user;
                this.otherUser = options.otherUser;
                this.messages = options.messages;
                this.tags = options.tags;
                this.workItemTags = this.tags.where({
                    name: this.model.get("title")
                });
                if (this.workItemTags.length === 0) {
                    this.workItemTags.add = ({
                        name: this.model.get("title")
                    });
                };
                this.filteredMessages = this.filterMessages();
                this.render();
            },
            onRender: function() {
                this.headerBox.show(new TaskHeaderview({
                    model: this.model
                }));
                this.tasksBox.show(new TaskView({
                    model: this.model,
                    collection: this.model.get("scopeItems")
                }));
                this.renderMessages();
                this.newMessage.show(new NewMessages({
                    tags: this.tags,
                    messageTags: this.workItemTags,
                    user: this.user,
                    otherUser: this.otherUser
                }));
                this.listenTo(this.newMessage.currentView, "commentAdded", this.commentAdded);
                this.listenTo(this.newMessage.currentView, "commentSaved", this.commentSaved);
            },
            renderMessages: function() {
                this.messagesBox.show(new MessagesBoxView({
                    collection: this.filteredMessages,
                    user: this.user,
                    otherUser: this.otherUser
                }));
            },
            showNewMessage: function(event) {
                event.preventDefault();
                event.stopPropagation();
                this.$('#new_comment_text').show();
                this.$('.add-more').replaceWith('<p style="margin-left:20px;" class="remove_icon"><a id="hide_workitem_comment" href="">Hide New Message</a></p>');
            },
            hideNewMessage: function() {
                event.preventDefault();
                event.stopPropagation();
                this.$('#new_comment_text').hide();
                this.$('.remove_icon').replaceWith('<p style="margin-left:20px;" class="add-more"><a id="add_workitem_comment" href="">Add A Message</a></p>')
            },
            filterMessages: function() {
                var title = this.model.get("title"),
                    filtered;
                if (title) {
                    filtered = this.messages;
                    filtered = filtered.filterByTagTitle(title);
                    filtered.comparator = function(item) {
                        return -item.get("dateCreated").valueOf();
                    };
                    filtered.sort();
                }
                return filtered;
            },
            commentAdded: function(comment) {
                this.messages.add(comment);
            },
            commentSaved: function() {
                this.filteredMessages = this.filterMessages();
                this.renderMessages();
            }

        });

        return Layout;

    }
);