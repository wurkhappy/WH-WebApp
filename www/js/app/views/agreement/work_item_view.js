
define(['backbone', 'handlebars', 'underscore', 'marionette',
  'hbs!templates/agreement/work_item_tpl', 'views/agreement/scope_item_view'],

  function (Backbone, Handlebars, _, Marionette, tpl, ScopeItemView) {

    'use strict';
    Handlebars.registerHelper('dateFormat', function(date) {
      return date.format('MMM D, YYYY');
    });

    var WorkItemView = Backbone.Marionette.CompositeView.extend({

      template: tpl,
      
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

return WorkItemView;

}
);
