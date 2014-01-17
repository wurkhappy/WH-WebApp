
define(['backbone', 'handlebars', 'underscore', 'marionette',
  'hbs!templates/agreement/work_item_tpl', 'views/ui-modules/modal', 'views/agreement/tasks_layout'],

  function (Backbone, Handlebars, _, Marionette, tpl, Modal, TasksLayout) {

    'use strict';
    var WorkItemView = Backbone.Marionette.ItemView.extend({

      template: tpl,

      initialize:function(options){
        this.collection = this.model.get("scopeItems");
        this.userIsClient = options.userIsClient;
        this.listenTo(this.model, 'change',this.checkStatus)
        this.user = options.user;
        this.otherUser = options.otherUser;
        this.messages = options.messages;
      },

      events:{
        "click .payment_milestone": "showWorkItem"
      },
      onRender:function(){
        this.checkStatus();
      },

      showWorkItem: function(event) {
        var view = new TasksLayout({model: this.model, collection: this.model.get("scopeItems"), user: this.user, otherUser: this.otherUser, messages: this.messages});
        this.modal = new Modal({view:view});
        this.modal.$(".panel").addClass("milestone_panel");
        this.modal.show();
      },

      checkStatus:function(){
        var status = this.model.get("currentStatus");
        if (!status) {
          return;
        }
        switch (status.get("action")){
          case status.StatusSubmitted:
          this.submittedState();
          break;
          case status.StatusAccepted:
          this.acceptedState();
          break;
          default:
        }
      },
      submittedState:function(){
        this.$('.paymentStatus').html('<span class="payment_status">Payment Pending</span>');
      },
      acceptedState:function(){
        this.$('.paymentStatus').html('<span class="payment_status">Payment Made</span>');
      }

    });

return WorkItemView;

}
);