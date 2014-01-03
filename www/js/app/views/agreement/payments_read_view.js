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
      itemViewOptions: function() {
         return {
          user: this.user,
          otherUser: this.otherUser,
          messages: this.messages
         };
      },

      initialize:function(options){
        this.collection = this.model.get("payments");
        this.user = options.user;
        this.otherUser = options.otherUser;
        this.messages = options.model.get('comments');
      },
      onRender:function(){
        this.$('#payments-total').text('$'+this.collection.getTotalAmount());
      },
      updateState:function(){
        var status = this.model.get("currentStatus");
      }
    });

    return PaymentReadView;

  }
  );