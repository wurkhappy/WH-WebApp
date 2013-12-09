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
      },

      render: function () {
        this.$el.html(this.template({title: this.title, value: this.value}));
        return this;
      },

    });

    return ProgressBarView;

  }
  );