define(['backbone', 'handlebars', 'hbs!templates/agreement/read/header_tpl',
        'views/agreement/read/header_states/accepted_state', 'views/agreement/read/header_states/created_state',
        'views/agreement/read/header_states/submitted_state', 'views/agreement/read/header_states/rejected_state',
        'views/agreement/read/header_states/draft_state', 'views/agreement/read/header_states/finished_state'
    ],

    function(Backbone, Handlebars, userTemplate, AcceptedState,
        CreatedState, SubmittedState, RejectedState, DraftState, FinishedState) {

        'use strict';

        var HeaderView = Backbone.View.extend({
            template: userTemplate,

            initialize: function(options) {
                this.listenTo(this.model, 'change:currentStatus', this.changeState);
                this.user = options.user;
                this.otherUser = options.otherUser
                this.changeState();
            },

            render: function() {
                var waiting;
                var isArchived = this.model.get("archived");
                var currentStatus = this.model.get("currentStatus");
                var finalStatus = this.model.get("final");
                var button1Title;
                var button2Title;
                var newAgreement;
                var archived;
                var user = this.user.toJSON();
                var otherUser = this.otherUser.toJSON();
                var client;
                var freelancer;

                // Determine if this user is the client or the freelancer

                if (this.model.get("clientID") === this.user.get("id")) {
                    client = user;
                    freelancer = otherUser;
                } else {
                    client = otherUser;
                    freelancer = user;
                }

                // Show the right buttons depending on the state.

                if (isArchived === true) {
                    button1Title = false;
                    button2Title = false;
                    waiting = false;
                    newAgreement = false;
                    archived = true;
                    if (finalStatus === false) {
                        button1Title = false;
                        button2Title = false;
                        waiting = false;
                        archived = false;
                        newAgreement = true;
                    }
                } else if (currentStatus !== null && this.state.button1Title === currentStatus.StatusWaiting) {
                    waiting = true;
                    button1Title = false;
                    button2Title = false;
                    newAgreement = false;
                    archived = false;
                } else {
                    waiting = false;
                    button1Title = this.state.button1Title;
                    button2Title = this.state.button2Title;
                    newAgreement = false;
                    archived = false;
                }

                this.$el.html(this.template({
                    model: this.model.toJSON(),
                    button1Title: button1Title,
                    button2Title: button2Title,
                    waiting: waiting,
                    archived: archived,
                    newAgreement: newAgreement,
                    client: client,
                    freelancer: freelancer
                }));

                $('body').scrollTop(0);

                return this;
            },
            events: {
                "click #action-button1": "debounceButton1",
                "click #action-button2": "debounceButton2",
            },
            debounceButton1: function(event) {
                event.preventDefault();
                event.stopPropagation();
                this.button1();
            },
            debounceButton2: function(event) {
                event.preventDefault();
                event.stopPropagation();
                this.button2();
            },
            button1: _.debounce(function(event) {
                this.state.button1();
            }, 500, true),
            button2: _.debounce(function(event) {
                this.state.button2();
            }, 500, true),
            changeState: function() {
                if (this.model.get("draft")) {
                    this.state = new DraftState({
                        model: this.model
                    });
                    this.render();
                    return;
                }
                var status = this.model.get("currentStatus");
                switch (status.get("action")) {
                    case status.StatusCreated:
                        this.state = new CreatedState({
                            model: this.model
                        });
                        break;
                    case status.StatusSubmitted:
                        this.state = new SubmittedState({
                            model: this.model,
                            user: this.user,
                            otherUser: this.otherUser
                        });
                        break;
                    case status.StatusAccepted:
                        if (this.model.get("payments").getTotalDue() === this.model.get("payments").getTotalPaid()) {
                            this.state = new FinishedState({
                                model: this.model,
                                user: this.user,
                                otherUser: this.otherUser
                            });
                            break;
                        }
                        this.state = new AcceptedState({
                            model: this.model,
                            user: this.user
                        });
                        break;
                    case status.StatusRejected:
                        this.state = new RejectedState({
                            model: this.model,
                            user: this.user,
                            otherUser: this.otherUser
                        });
                        break;
                    default:
                }
                this.render();
            },

        });

        return HeaderView;

    }
);