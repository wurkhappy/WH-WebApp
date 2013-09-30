/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore',
  'text!templates/home/agreement_tpl.html'],

  function (Backbone, Handlebars, _, agreementTpl) {

    'use strict';

    var AgreementView = Backbone.View.extend({

      tagName:'tr',
      template: Handlebars.compile(agreementTpl),

      initialize: function (options) {
      },

      render: function () {
        var status = _.clone(this.model.get("statusHistory").at(0).attributes);
        console.log(status.date);
        status.date = status.date.format('MMM D, YYYY');
        this.$el.html(this.template({model: this.model.toJSON(), status: status}));
        return this;

      }
});

    return AgreementView;

  }
  );