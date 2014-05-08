/*
 * Home - Introduction Progress View.
 */

 define(['backbone', 'handlebars','underscore', 'marionette',
  'hbs!templates/sample_home/introduction_progress_tpl'],

  function (Backbone, Handlebars, _, Marionette, introductionProgressTemplate) {

    'use strict';

    var IntroductionProgressView = Backbone.Marionette.ItemView.extend({

      template: introductionProgressTemplate,

    });

    return IntroductionProgressView;

  }
  );