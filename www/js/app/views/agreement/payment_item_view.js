
define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/agreement/payment_item_tpl.html', 'views/agreement/scope_item_view'],

  function (Backbone, Handlebars, _, Marionette, paymentItemTemplate, ScopeItemView) {

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
      onRender:function(){
        this.checkStatus();
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
