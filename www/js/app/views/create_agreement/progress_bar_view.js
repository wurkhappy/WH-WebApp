/*
 * Agreement - Create Progress Bar View.
 */

 define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/create_agreement/progress_bar_tpl.html'],

  function (Backbone, Handlebars, _, Marionette, progressBarTemplate) {

    'use strict';
    Handlebars.registerHelper('icon_color', function(position, value) {
      if (position <= value/100 || position == 0) return 'green_icon';
      return '';
    });

    var ProgressBarView = Backbone.View.extend({

      template: Handlebars.compile(progressBarTemplate),

      initialize:function(options){
        this.title = options.title;
        this.value = (options.value/2)*100;
      },

      render: function () {
        this.$el.html(this.template({title: this.title, value: this.value}));
        return this;
      },

    });

    return ProgressBarView;

  }
  );