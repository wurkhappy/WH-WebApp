/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/agreement/layout_tpl.html'],

  function (Backbone, Handlebars, _, Marionette, layoutTpl) {

    'use strict';

    var Layout = Backbone.Marionette.Layout.extend({
      el:'#content',
      template: Handlebars.compile(layoutTpl),

      regions: {
        profile: "#agreement-profile",
        agreementProgressBar: "#agreement-progress-bar",
        paymentSchedule: "#payment-schedule",
        clauses:"#clauses",
        agreementHistory: "#agreement-history",
        header: "#header-section",
        discussion: "#discussion"
      },

      initialize: function(){
        this.render();
      }
    });

    return Layout;

  }
  );