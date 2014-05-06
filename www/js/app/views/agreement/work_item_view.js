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
                "click .deliverable_header": "showWorkItem",
                "click .checkbox": "toggleCheckbox"
            },
            initialize: function(options) {
                this.collection = this.model.get("subTasks");
                this.userIsClient = options.userIsClient;
                this.listenTo(this.model, 'change', this.checkStatus);
                this.listenTo(this.model, 'change:lastAction', this.render);
                this.listenTo(this.collection, 'change', this.render);
                this.user = options.user;
                this.otherUser = options.otherUser;
                this.messages = options.messages;
                this.tags = options.tags;
                this.listenTo(this.collection, "completed", this.taskStatusChange);
                this.hasSubTasks = this.collection.length > 0;
            },

            renderModel: function() {
                var data = this.model.toJSON();
                data.numberOfTasks = this.collection.length;
                data.tasksCompleted = this.collection.getCompleted().length;
                data.hasSubTasks = this.hasSubTasks;
                data.completed = this.model.isComplete()

                if (data.completed) {
                    data.color = 'green';
                } else {
                    data.color = 'orange';
                }

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
                // but only trigger if the height hasn't been set, i.e. page hasn't refreshed.
                // otherwise close will be triggered when task is checked.
                if (!this.height) {
                    var that = this;
                    _.delay(function() {
                        that.hideWorkItemsOnLoad();
                    }, 100);
                }

            },
            showWorkItem: function(event) {
                if (!this.hasSubTasks) {
                    return;
                }
                console.log("show");

                this.showingItem = !this.showingItem;

                if (this.showingItem) {
                    if (!this.height) this.height = this.$('.payment_milestone').height();
                    this.$('.payment_milestone').animate({
                        'height': '63px'
                    });
                    this.$('.show_details_button').text(' Show Details');
                } else {

                    this.$('.payment_milestone').animate({
                        'height': this.height + 'px'
                    });
                    this.$('.show_details_button').text(' Hide Details');
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
            toggleCheckbox: function(event) {
                if (this.model.isComplete()) {
                    this.model.noAction();
                } else {
                    this.model.completed({});
                }
            },
            checkStatus: function() {
                var status = this.model.get("lastAction");
                if (!status) {
                    return;
                }
                switch (status.get("name")) {
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
                if (this.model.get("sample")) {
                    return;
                }
                this.model.save();
            }, 1000)
        });
        return WorkItemView;
    }
);