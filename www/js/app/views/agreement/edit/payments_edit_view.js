define(['backbone', 'handlebars', 'underscore', 'marionette',
  'hbs!templates/agreement/edit/payment_edit_tpl', 'views/agreement/edit/payment_item_view',
  'views/agreement/payment_item_view'],

  function (Backbone, Handlebars, _, Marionette, paymentEditTemplate, PaymentItemView, PaymentPaidView) {

    'use strict';

    var PaymentEditView = Backbone.Marionette.CompositeView.extend({

      template: paymentEditTemplate,

      itemView: PaymentItemView,
      itemViewContainer:'ul',

      initialize:function(){
        this.collection = this.model.get("payments");
      },
      events:{
        "click #addMoreButton" : "addMilestone"
      },
      getItemView: function(item) {
        var status  = item.get("currentStatus");
        if (status && (status.get("action") === "accepted" || status.get("action") === "submitted")) return PaymentPaidView;
        return PaymentItemView;
      },

      addMilestone:function(event){
        this.collection.add({amount:0.00, title:"New Milestone"});
      },

    });

    return PaymentEditView;

  }
  );