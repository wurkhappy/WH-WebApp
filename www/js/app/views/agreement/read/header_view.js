
define(['backbone', 'handlebars', 'text!templates/agreement/read/header_tpl.html',
  'views/agreement/read/header_states/accepted_state', 'views/agreement/read/header_states/created_state',
  'views/agreement/read/header_states/submitted_state', 'views/agreement/read/header_states/rejected_state',
  'views/agreement/read/header_states/draft_state'],

  function (Backbone, Handlebars, userTemplate, AcceptedState,
    CreatedState, SubmittedState, RejectedState, DraftState) {

    'use strict';

    var HeaderView = Backbone.View.extend({
      template: Handlebars.compile(userTemplate),

      initialize:function(options){
        this.listenTo(this.model.get("statusHistory"), 'add', this.changeState);
        this.changeState();
        this.user = options.user;
      },

      render:function(){
        this.$el.html(this.template({
          model: this.model.toJSON(), 
          button1Title: this.state.button1Title,
          button2Title: this.state.button2Title
        }));

        return this;
      },
      events:{
        "click #action-button1":"button1",
        "click #action-button2":"button2",
      },
      button1:function(event){
        if (!this.user.get("isVerified")){
          return;
        }
        this.state.button1();
      },
      button2:function(event){
        if (!this.user.get("isVerified")){
          return
        }
        this.state.button2();
      },
      changeState:function(){
        var status = this.model.get("statusHistory").at(0);
        switch (status.get("action")){
          case status.StatusCreated:
          this.state = new CreatedState({model: this.model});
          break;
          case status.StatusSubmitted:
          this.state = new SubmittedState({model: this.model, user: this.options.user});
          break;
          case status.StatusAccepted:
          this.state = new AcceptedState({model: this.model, user: this.options.user});
          break;
          case status.StatusRejected:
          this.state = new RejectedState({model: this.model});
          break;
          default:
        }
        if (this.model.get("draft")) this.state = new DraftState({model: this.model});
        this.render();
      },

    });

return HeaderView;

}
);