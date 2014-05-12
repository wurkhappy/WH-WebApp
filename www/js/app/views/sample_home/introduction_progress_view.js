/*
 * Home - Introduction Progress View.
 */

 define(['backbone', 'handlebars','underscore', 'marionette',
  'hbs!templates/sample_home/introduction_progress_tpl'],

  function (Backbone, Handlebars, _, Marionette, introductionProgressTemplate) {

    'use strict';

    var IntroductionProgressView = Backbone.Marionette.ItemView.extend({

      template: introductionProgressTemplate,

      events: {
      	"mouseenter #getting_started_progress_container": "showProgressDetails",
      	"mouseleave #getting_started_container": "hideProgressDetails"
      },

      showProgressDetails: function() {
      	$('#getting_started_container').fadeIn();
      },

      hideProgressDetails: function () {
      	$('#getting_started_container').fadeOut();
      }
 
    });

    return IntroductionProgressView;

  }
  );