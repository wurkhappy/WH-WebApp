
 define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/agreement/payment_item_tpl.html', 'views/agreement/scope_item_view'],

  function (Backbone, Handlebars, _, Marionette, paymentItemTemplate, ScopeItemView) {

    'use strict';

    var PaymentEditView = Backbone.Marionette.CompositeView.extend({

      template: Handlebars.compile(paymentItemTemplate),

      itemView: ScopeItemView,
      itemViewContainer:'.scope_items_container',

      initialize:function(){
        this.collection = this.model.get("scopeItems");
      }

    });

    return PaymentEditView;

  }
  );