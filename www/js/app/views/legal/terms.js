
/*
 * Terms View.
 */

 define(['backbone', 'handlebars', 'jquery', 'hbs!templates/legal/terms'],

  function (Backbone, Handlebars, $, termsTemplate) {

    'use strict';

    var TermsView = Backbone.View.extend({

      template: termsTemplate,

      initialize:  function() {
        this.render();
      },

      render: function () {
        $(this.el).html(this.template());
        return this;
      },

      events: {
          "click .faqnav a" : "toggleSection"
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

    return TermsView;

  }
  );