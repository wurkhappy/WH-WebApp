
define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/agreement/payment_item_tpl.html', 'views/agreement/work_item_view', 'views/agreement/scope_item_view',  'views/ui-modules/modal'],

  function (Backbone, Handlebars, _, Marionette, paymentItemTemplate, WorkItemView, ScopeItemView, Modal) {

    'use strict';
    Handlebars.registerHelper('dateFormat', function(date) {
      return date.format('MMM D, YYYY');
    });

    var PaymentItemView = Backbone.Marionette.CompositeView.extend({

      template: Handlebars.compile(paymentItemTemplate),
      
      itemView: ScopeItemView,
      itemViewContainer:'.scope_items_container',

      initialize:function(options){
        this.collection = this.model.get("scopeItems");
        this.userIsClient = options.userIsClient;
        this.listenTo(this.model, 'change',this.checkStatus)
          //.get("dateExpected").format("MMM Do YYYY"))
      },

      events:{
        "click .payment_milestone": "showWorkItem"
      },
      onRender:function(){
        this.checkStatus();
      },

      showWorkItem: function(event) {
        console.log(this.model);
        console.log("this is the item");

        console.log(event.currentTarget.getAttribute('data-work-item'))

        var view = new WorkItemView({model: this.model, collection: this.model.get("scopeItems")});

        this.modal = new Modal({view:view});
        this.modal.$(".panel").addClass("milestone_panel");
        this.modal.show();

        if ($('.panel').is(":visible")) {
          $('body').addClass('hide_overflow');
        } else {
          $('body').removeClass('hide_overflow');
        }
        
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
