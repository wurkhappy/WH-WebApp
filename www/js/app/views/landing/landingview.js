
/*
 * Landing main View.
 */

 define(['backbone', 'handlebars', 'jquery', 'parsley', 'views/landing/loginview', 
  'text!templates/landing/landingview.html', 'text!templates/landing/about.html', 'text!templates/landing/pricing.html'],

  function (Backbone, Handlebars, $, parsley, LoginView, landingTemplate, aboutTemplate, pricingTemplate) {

    'use strict';

    var MainView = Backbone.View.extend({

      el: '#intro',

      template: Handlebars.compile(landingTemplate),

      render: function () {

        $(this.el).html(this.template());

        return this;

      },

    });

    return MainView;

  }
  );