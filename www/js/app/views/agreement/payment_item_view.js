
define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/agreement/payment_item_tpl.html', 'views/agreement/scope_item_view'],

  function (Backbone, Handlebars, _, Marionette, paymentItemTemplate, ScopeItemView) {

    'use strict';

    var PaymentItemView = Backbone.Marionette.CompositeView.extend({

      template: Handlebars.compile(paymentItemTemplate),

      itemView: ScopeItemView,
      itemViewContainer:'.scope_items_container',

      events:{
        "click .request-button":"submitPayment"
      },

      initialize:function(options){
        this.collection = this.model.get("scopeItems");
        this.dispatcher = options.dispatcher;
        this.userIsClient = options.userIsClient;
        this.listenTo(this.model, 'change:currentStatus',this.checkStatus)
        this.listenTo(this.dispatcher, 'lockPaymentRequests', this.updateGlobalStatus);
      },
      onRender:function(){
        this.checkStatus();
      },
      updateGlobalStatus: function(lockRequests){
        this.blockRequests = lockRequests;
        this.checkStatus();
      },
      checkStatus:function(){
        var status = this.model.get("currentStatus");
        if (!status) {
          this.defaultState();
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
          this.defaultState();
        }
      },
      defaultState:function(){
        if (!this.userIsClient && !this.blockRequests){
          this.$('.paymentStatus').html('<span class="request-button payment_status make_payment">Request Payment</span>');
        }
        else{
          this.$('.paymentStatus').html('');
        }
      },
      submittedState:function(){
        this.$('.paymentStatus').html('<span class="payment_status">Payment Pending</span>');
      },
      acceptedState:function(){
        this.$('.paymentStatus').html('<span class="payment_status">Payment Made</span>');
      },
      submitPayment:function(){
        this.model.submit();
      }

    });

return PaymentItemView;

}
);
