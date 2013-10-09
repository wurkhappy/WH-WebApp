
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
          "click #login": "triggerLogin",
          "click #cancel": "cancelLogin",
          "click #pricing-button": 'switchToPricing',
          "click #about-button": 'switchToAbout'
        },

        initialize: function () {

          this.$aboutContainer = $("#about-container");
          this.$login = $(".fade2");
          $('#create_form').parsley(); //initialize form validation
        },


        triggerLogin: function () {

          var loginView = new LoginView();

          this.$login.html(loginView.render().el);

          var t1 = setTimeout(function () {
            $('#logindiv').fadeIn('fast');
            $('#login_form').parsley(); //initialize form validation
          }, 200);

          var t2 = setTimeout(function () {
            $('#target').focus();
          }, 300);

          // delay the focus function on the email input so that the function isn't called until
          // after the login appears.
          // wrap it in setTimeout because delay is limited
          // set an identifier to SetTimeout so that it can be cleared later on.

          // hide stuff, show stuff, add class, fade stuff
          $('#log_in').hide();
          $('#log_out').show();
          $('.copyright').addClass('fixed');
          $('#navigation').addClass('line');
          $('.fade').fadeOut('fast');

        },

        cancelLogin: function () {

          this.$login.html(this.template());
          this.$login.hide();
          this.$login.fadeIn('fast');

          //Do the same thing as triggerLogin but opposite
            $('#log_out').hide();
            $('#log_in').show();
            $('.copyright').removeClass('fixed');
            $('#navigation').removeClass('line');
            $('#logindiv').fadeOut('fast');
            $('.fade').fadeIn('slow');

        },
        switchToAbout: function(event){
          this.switchTab(aboutTemplate)
          $("#about-button").addClass("current");
        },
        switchToPricing: function(event){
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