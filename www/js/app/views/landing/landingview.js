
/*
 * Landing main View.
 */

define(['backbone', 'handlebars', 'jquery', 'views/landing/loginview', 
  'text!templates/landing/landingview.html', 'text!templates/landing/about.html', 'text!templates/landing/pricing.html'],

    function(Backbone, Handlebars, $, LoginView, landingTemplate, aboutTemplate, pricingTemplate) {

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
          $('.login').hide();
          $('#log_out').hide();

        },


        triggerLogin: function () {

          var loginView = new LoginView();

          console.log("trigger login initialized");

          //this.$fade1.fadeOut("fast");


          this.$login.html(loginView.render().el);

          var t1 = setTimeout(function () {
            $('.login').fadeIn('fast');
          }, 200);

          var t2 = setTimeout(function () {
            $('#target').focus();
          }, 300);

          console.log("I've rendered the view");


          // delay the focus function on the email input so that the function isn't called until
          // after the login appears.
          // wrap it in setTimeout because delay is limited
          // set an identifier to SetTimeout so that it can be cleared later on.





          // hide stuff, show stuff, add class, fade stuff
          $('#log_in').hide();
          $('#log_out').show();
          $('#copyright').addClass('fixed');
          $('#navigation').addClass('line');
          $('.fade').fadeOut('fast');

          //hide error messages from other form
          $('#server_error').html('');
          $('.validation').html('');
          $('input#email-field').removeClass('border');

        },


        cancelLogin: function () {

          this.$login.html(this.template());
          this.$login.hide();
          this.$login.fadeIn('fast');

          //Do the same thing as triggerLogin but opposite
            $('#log_out').hide();
            $('#log_in').show();
            $('#copyright').removeClass('fixed');
            $('#navigation').removeClass('line');
            $('.login').fadeOut('fast');
            $('.fade').fadeIn('slow');

            //hide error messages from other form
            $('#server_error').html('');
            $('.validation').html('');
            $('input#email-field').removeClass('border');

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