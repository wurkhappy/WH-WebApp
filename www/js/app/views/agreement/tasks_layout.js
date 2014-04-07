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
            }

        });

        return Layout;

    }
);