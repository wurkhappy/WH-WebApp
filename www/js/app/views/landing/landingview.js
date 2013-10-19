
/*
 * Landing main View.
 */

define(['backbone', 'handlebars', 'jquery', 'parsley', 'views/landing/loginview', 
  'text!templates/landing/landingview.html', 'text!templates/landing/about.html', 'text!templates/landing/pricing.html'],

    function (Backbone, Handlebars, $, parsley, LoginView, landingTemplate, aboutTemplate, pricingTemplate) {

      'use strict';

      var MainView = Backbone.View.extend({

        el: '.container',

        template: Handlebars.compile(landingTemplate),

        events: {
          "click #login": "showLogin",
          "click #cancel": "hideLogin",
          "click #pricing-button": 'switchToPricing',
          "click #about-button": 'switchToAbout'
        },

        initialize: function () {

          this.$aboutContainer = $("#about-container");
          this.$login = $(".fade2");
          $('#create_form').parsley(); //initialize form validation
        },


        showLogin: function () {

          var loginView = new LoginView();

          this.$login.html(loginView.render().el);

          $('#logindiv').fadeIn('slow');
          $('#target').focus();
          $('#login_form').parsley(); //initialize form validation
          $('#log_in').hide();
          $('#log_out').show();

        },

        hideLogin: function () {

          this.$login.html(this.template());
          $('#create_form').parsley();
          this.$login.hide();
          this.$login.fadeIn('fast');

          $('#log_out').hide();
          $('#log_in').show();
          $('#logindiv').fadeOut('fast');

        },
        switchToAbout: function(event){
          this.switchTab(aboutTemplate)
          $("#about-button").addClass("current");
        },
        switchToPricing: function(event){
          console.log("something happening");
          this.switchTab(pricingTemplate)
          $("#pricing-button").addClass("current");
        },
        switchTab:function(template){
          var tpl = Handlebars.compile(template);
          $('#about-container').empty().append(tpl());
          $(".tab").removeClass("current"); 
        }

      });

      return MainView;

    }
);