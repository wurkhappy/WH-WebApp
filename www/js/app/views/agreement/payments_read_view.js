/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/agreement/payment_read_tpl.html', 'views/agreement/payment_item_view'],

  function (Backbone, Handlebars, _, Marionette, paymentScopeTemplate, PaymentItemView) {

    'use strict';

    var PaymentReadView = Backbone.Marionette.CompositeView.extend({

      template: Handlebars.compile(paymentScopeTemplate),

      itemView: PaymentItemView,
      itemViewContainer:'ul',
      itemViewOptions:function(){
        return {
          dispatcher: this.dispatcher,
          userIsClient: this.userIsClient
        };
      },

      initialize:function(){
        this.dispatcher = _.clone(Backbone.Events);
        this.userIsClient = window.thisUser.id === this.model.get("clientID");
        this.collection = this.model.get("payments");
        this.listenTo(this.model, 'change:currentStatus', this.updateState);
      },
      onRender:function(){
        this.$('#payments-total').text('$'+this.collection.getTotalAmount());
        this.updateState();
      },
      updateState:function(){
        var status = this.model.get("currentStatus");

        var lockPaymentRequests = false;
        if (status.get("action") === status.StatusSubmitted) lockPaymentRequests = true;
        this.dispatcher.trigger('lockPaymentRequests', lockPaymentRequests);
      }
    });

    return PaymentReadView;

  }
  );