
define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/agreement/payment_item_tpl.html', 'views/agreement/work_item_view',  'views/ui-modules/modal', 'views/agreement/work_item_layout'],

  function (Backbone, Handlebars, _, Marionette, paymentItemTemplate, WorkItemView, Modal, WorkItemLayout) {

    'use strict';
    Handlebars.registerHelper('dateFormat', function(date) {
      return date.format('MMM D, YYYY');
    });

    var PaymentItemView = Backbone.Marionette.ItemView.extend({

      template: Handlebars.compile(paymentItemTemplate),

      initialize:function(options){
        this.collection = this.model.get("scopeItems");
        this.userIsClient = options.userIsClient;
        this.listenTo(this.model, 'change',this.checkStatus)
          //.get("dateExpected").format("MMM Do YYYY"))
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
        var view = new WorkItemLayout({model: this.model, collection: this.model.get("scopeItems"), user: this.user, otherUser: this.otherUser, messages: this.messages });
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

return PaymentItemView;

}
);
