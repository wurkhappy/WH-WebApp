/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/agreement/payment_edit_tpl.html', 'views/agreement/payment_item_view'],

  function (Backbone, Handlebars, _, Marionette, paymentScopeTemplate, PaymentItemView) {

    'use strict';

    var PaymentEditView = Backbone.Marionette.CompositeView.extend({

      template: Handlebars.compile(paymentScopeTemplate),

      itemView: PaymentItemView,
      itemViewContainer:'ul',

      initialize:function(){
        this.collection = this.model.get("workItems");
      }

    });

    return PaymentEditView;

  }
  );