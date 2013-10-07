/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/agreement/agreement_history_tpl.html', 'views/agreement/status_view'],

  function (Backbone, Handlebars, _, Marionette, agreementHistoryTemplate, StatusView) {

    'use strict';

    var PaymentItemView = Backbone.Marionette.CompositeView.extend({

      tagName: 'ul',
      className: 'agreement_history_items_container',

      template: Handlebars.compile(agreementHistoryTemplate),

      itemView: StatusView,

      initialize:function(){
        this.collection = this.model.get("statusHistory");
        console.log(this.collection);
      }

    });

    return PaymentItemView;

  }
  );