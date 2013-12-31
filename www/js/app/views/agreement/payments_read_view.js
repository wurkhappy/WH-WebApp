define(['backbone', 'handlebars', 'underscore', 'marionette',
  'hbs!templates/agreement/payment_read_tpl', 'views/agreement/payment_item_view'],

  function (Backbone, Handlebars, _, Marionette, paymentScopeTemplate, PaymentItemView) {

    'use strict';

    var PaymentReadView = Backbone.Marionette.CompositeView.extend({

      template: paymentScopeTemplate,

      itemView: PaymentItemView,
      itemViewContainer:'ul',

      // initialize:function(){
      //   this.collection = this.model.get("workItems");
      // },
      onRender:function(){
        this.$('#payments-total').text('$'+this.collection.getTotalAmount());
      },
      // updateState:function(){
      //   var status = this.model.get("currentStatus");
      // }
    });

    return PaymentReadView;

  }
  );