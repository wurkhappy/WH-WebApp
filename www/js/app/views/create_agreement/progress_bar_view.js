/*
 * Agreement - Create Progress Bar View.
 */

 define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/create_agreement/progress_bar_tpl.html'],

  function (Backbone, Handlebars, _, Marionette, progressBarTemplate) {

    'use strict';
    Handlebars.registerHelper('icon_color', function(position, value) {
      if (position <= value/34 || position == 0) return 'green_icon';
      return '';
    });

    var ProgressBarView = Backbone.View.extend({

      template: Handlebars.compile(progressBarTemplate),

      initialize:function(options){
        this.title = options.title;
        this.value = (options.value/3)*100;
      },

      render: function () {
        this.$el.html(this.template({title: this.title, value: this.value}));
        return this;
      },

      events: {
        "click .create_agreement_navigation_link": "validateProposal",
        "mouseenter .create_agreement_navigation_link": "mouseEnterNavigation",
        "mouseleave .create_agreement_navigation_link": "mouseLeaveNavigation"
      },

      validateProposal: function(event) {

        if ($( '.proposal_form' ).html()) {
          var isValid = $( '.proposal_form' ).parsley( 'isValid' );
          if (isValid) {
            return;
          } else {
             event.preventDefault();
             $( '.proposal_form' ).parsley( 'validate' );
          }
        }
      },

      mouseEnterNavigation: function (event) {
          $(event.currentTarget).find("h2").addClass("create_agreement_navigation_link_hover");
      },

      mouseLeaveNavigation: function (event) {
          $(event.currentTarget).find("h2").removeClass("create_agreement_navigation_link_hover");
      }


    });

    return ProgressBarView;

  }
  );