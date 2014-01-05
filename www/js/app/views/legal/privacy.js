
/*
 * Terms View.
 */

 define(['backbone', 'handlebars', 'jquery', 'hbs!templates/legal/privacy'],

  function (Backbone, Handlebars, $, privacyTemplate) {

    'use strict';

    var PrivacyView = Backbone.View.extend({

      template: privacyTemplate,

      initialize:  function() {
        this.render();
        $(window).scroll(this.updatePosition);
      },

      render: function () {
        $(this.el).html(this.template());
        return this;
      },

      events: {
          "click .faqnav a" : "toggleSection"
      },

      updatePosition: function() {
        if ( $(window).scrollTop() + $(window).height() > $(document).height() - 200) {
          $(".faqnav").addClass('fixed_bottom');
        } else{
          $(".faqnav").removeClass('fixed_bottom');
        }
      },

      toggleSection: function(event) {
        event.preventDefault();

        var $section = $(event.target);

        var sectionHash = event.target.hash;

        $('.faqnav li').removeClass('current');

        $section.closest('li').addClass('current');

        $('.section').hide();

        $(sectionHash).fadeIn();
      }

    });

    return PrivacyView;

  }
  );