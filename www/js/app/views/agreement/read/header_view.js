
define(['backbone', 'handlebars', 'noty', 'noty-inline', 'noty-default', 'text!templates/agreement/read/header_tpl.html',
  'views/agreement/read/header_states/accepted_state', 'views/agreement/read/header_states/created_state',
  'views/agreement/read/header_states/submitted_state', 'views/agreement/read/header_states/rejected_state',
  'views/agreement/read/header_states/draft_state'],

  function (Backbone, Handlebars, noty, noty_layout, noty_default, userTemplate, AcceptedState,
    CreatedState, SubmittedState, RejectedState, DraftState) {

    'use strict';

    var HeaderView = Backbone.View.extend({
      template: Handlebars.compile(userTemplate),

      initialize:function(options){
        this.listenTo(this.model, 'change:currentStatus', this.changeState);
        this.user = options.user;
        this.otherUser = options.otherUser
        this.changeState();
        console.log(this.model);
      },

      render:function(){
        var waiting;
        var currentStatus = this.model.get("currentStatus");

        if (this.currentStatus !== null) {
          if (this.state.button1Title === this.model.get("currentStatus").StatusWaiting) {
            waiting = true;
          }
        } else {
          waiting = false;
        }

        

        this.$el.html(this.template({
          model: this.model.toJSON(), 
          button1Title: this.state.button1Title,
          button2Title: this.state.button2Title,
          waiting: waiting
        }));

        return this;
      },
      events:{
        "click #action-button1":"button1",
        "click #action-button2":"button2",
      },
      button1:function(event){
        /*if (!this.user.get("isVerified")){
          var n = $('#notifications').noty({type: 'error',text: 'Please check your e-mail and verify your account.', timeout: 2000, dismissQueue:false});
          return;
        }*/
        this.state.button1();
      },
      button2:function(event){
        /*if (!this.user.get("isVerified")){
          var n = $('#notifications').noty({type: 'error',text: 'Please check your e-mail and verify your account.', timeout: 2000,  dismissQueue:false});
          return;
        }*/
        this.state.button2();
      },
      changeState:function(){
        if (this.model.get("draft")){
          this.state = new DraftState({model: this.model});
          this.render();
          return;
        }
        var status = this.model.get("currentStatus");
        switch (status.get("action")){
          case status.StatusCreated:
          this.state = new CreatedState({model: this.model});
          break;
          case status.StatusSubmitted:
          this.state = new SubmittedState({model: this.model, user: this.user, otherUser: this.otherUser});
          break;
          case status.StatusAccepted:
          this.state = new AcceptedState({model: this.model, user: this.user});
          break;
          case status.StatusRejected:
          this.state = new RejectedState({model: this.model});
          break;
          default:
        }
        this.render();
      },

    });

return HeaderView;

}
);