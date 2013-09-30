/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/create_agreement/payment_scope_tpl.html', 'views/create_agreement/scope_item_view'],

  function (Backbone, Handlebars, _, Marionette, paymentScopeTemplate, ScopeItemView) {

    'use strict';

    var PaymentScopeView = Backbone.Marionette.CompositeView.extend({

      className:'scopeWrapper',

      template: Handlebars.compile(paymentScopeTemplate),

      itemView: ScopeItemView,
      itemViewContainer:'ul',

      events:{
        "keypress input" : "addOnEnter"
      },

      addOnEnter: function(event){
        if (event.keyCode == 13) {
          this.collection.add({text:event.target.value});
          event.target.value = null;
        }
      }

    });

    return PaymentScopeView;

  }
  );