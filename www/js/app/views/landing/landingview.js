
/*
 * Landing main View.
 */

 define(['backbone', 'handlebars', 'jquery', 'parsley', 'views/landing/loginview', 
  'hbs!templates/landing/landingview'],

  function (Backbone, Handlebars, $, parsley, LoginView, landingTemplate) {

    'use strict';

    var MainView = Backbone.View.extend({

      el: '#intro',

      template: landingTemplate,

      render: function () {

        $(this.el).html(this.template());

        return this;

      },

    });

    return MainView;

  }
  );