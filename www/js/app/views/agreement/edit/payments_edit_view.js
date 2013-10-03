define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/agreement/edit/payment_edit_tpl.html', 'views/agreement/edit/payment_item_view'],

  function (Backbone, Handlebars, _, Marionette, paymentScopeTemplate, PaymentItemView) {

    'use strict';

    var PaymentEditView = Backbone.Marionette.CompositeView.extend({

      template: Handlebars.compile(paymentScopeTemplate),

      itemView: PaymentItemView,
      itemViewContainer:'ul',

      initialize:function(){
        this.collection = this.model.get("payments");
      },
      events:{
        "click #addMoreButton" : "addMilestone"
      },

      addMilestone:function(event){
        this.collection.add({amount:0.00, title:"New Milestone"});
      },

    });

    return PaymentEditView;

  }
  );