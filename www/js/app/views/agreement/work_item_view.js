define(['backbone', 'handlebars', 'underscore', 'marionette',
        'hbs!templates/agreement/work_item_tpl', 'views/ui-modules/modal', 'views/agreement/tasks_layout',
        'views/agreement/task_view'
    ],

    function(Backbone, Handlebars, _, Marionette, tpl, Modal, TasksLayout, TaskItem) {

        'use strict';
        var WorkItemView = Backbone.Marionette.CompositeView.extend({

            template: tpl,
            itemView: TaskItem,
            itemViewContainer: ".tasks_container",
            events: {
                "click .payment_milestone": "showWorkItem"
            },
            initialize: function(options) {
                this.collection = this.model.get("scopeItems");
                this.userIsClient = options.userIsClient;
                this.listenTo(this.model, 'change', this.checkStatus);
                this.listenTo(this.collection, 'change', this.render);
                this.user = options.user;
                this.otherUser = options.otherUser;
                this.messages = options.messages;
                this.tags = options.tags;
                this.listenTo(this.collection, "change:completed", this.taskStatusChange);
            },

            renderModel: function() {
                var data = this.model.toJSON();
                data.numberOfTasks = this.collection.length;
                data.tasksCompleted = this.collection.getCompleted().length;
                data = this.mixinTemplateHelpers(data);

                var template = this.getTemplate();
                return Marionette.Renderer.render(template, data);
            },
            onRender: function() {
                this.checkStatus();
                if (this.model.isPaid()) {
                    _.defer(_.bind(this.showWorkItem, this));
                }

                // delay hiding of slightly so that height of the item can be stored.
                var that = this;
                _.delay( function() {
                    that.hideWorkItemsOnLoad();
                }, 100);
                
            },

            showWorkItem: function(event) {
                this.showingItem = !this.showingItem;

                if (this.showingItem) {
                    console.log(this);
                    if (!this.height) this.height = this.$('.payment_milestone').height();
                    console.log(this.$('.payment_milestone').height());
                    this.$('.payment_milestone').animate({
                        'height': '63px'
                    });
                    this.$('.show_details_button').text('Show Details');
                } else {

                    this.$('.payment_milestone').animate({
                        'height': this.height + 'px'
                    });
                    this.$('.show_details_button').text('Hide Details');
                }
            },

            hideWorkItemsOnLoad: function() {
                this.height = this.$('.payment_milestone').height();
                this.$('.payment_milestone').animate({
                    'height': '63px'
                }, 100);
                this.$('.show_details_button').text('Show Details');
                this.showingItem = true;
            },

            checkStatus: function() {
                var status = this.model.get("currentStatus");
                if (!status) {
                    return;
                }
                switch (status.get("action")) {
                    case status.StatusSubmitted:
                        this.submittedState();
                        break;
                    case status.StatusAccepted:
                        this.acceptedState();
                        break;
                    default:
                }
            },
            submittedState: function() {
                this.$('.paymentStatus').html('<span class="payment_status">Payment Pending</span>');
            },
            acceptedState: function() {
                this.$('.paymentStatus').html('<span class="payment_status">Payment Made</span>');
            },
            taskStatusChange: _.debounce(function() {
                this.model.save();
            }, 1000)
        });
        return WorkItemView;
    }
);