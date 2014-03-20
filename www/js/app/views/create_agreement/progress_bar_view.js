/*
 * Agreement - Create Progress Bar View.
 */

 define(['backbone', 'handlebars', 'underscore', 'marionette',
  'hbs!templates/create_agreement/progress_bar_tpl'],

  function (Backbone, Handlebars, _, Marionette, progressBarTemplate) {

    'use strict';

    var ProgressBarView = Backbone.View.extend({

      template: progressBarTemplate,

      initialize:function(options){
        this.title = options.title;
        this.value = (options.value/3)*100;

        // assign values for the progress bar icons.
        if (options.value === 1 ){
          this.icon_color1 = 'green_progress';
        } else if (options.value === 2 ) {
          this.icon_color1 = 'green_progress';
          this.icon_color2 = 'green_progress';

        } else if (options.value === 3 ) {
          this.icon_color1 = 'green_progress';
          this.icon_color2 = 'green_progress';
          this.icon_color3 = 'green_progress';
        }
        
      },

      render: function () {
        this.$el.html(this.template({
          title: this.title, 
          value: this.value,
          icon_color1: this.icon_color1,
          icon_color2: this.icon_color2,
          icon_color3: this.icon_color3
        }));
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