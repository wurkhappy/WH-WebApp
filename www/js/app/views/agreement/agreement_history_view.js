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

        /*_.each(this.model.get("statusHistory").models, function (model) {
          var date = model[index].attributes.date.format('MMM D, YYYY'), this
        }*/
        ///

        var models = this.model.get("statusHistory").models;

        _.each(models, function (element, index) {console.log(element.get("date").format('MMM D, YYYY'))});


        ///

      }

    });

    return PaymentItemView;

  }
  );