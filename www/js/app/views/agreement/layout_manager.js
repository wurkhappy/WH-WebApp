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
        paymentSchedule: "#payment-schedule",
        agreementHistory: "#agreement-history",
        header: "#header-section"
      },

      initialize: function(){
        this.render();
      }
    });

    return Layout;

  }
  );