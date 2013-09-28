/*
 * signup main container view View.
 */

define(['backbone', 'handlebars'],

    function (Backbone, Handlebars) {

      'use strict';

      var MainContainerView = Backbone.View.extend({

        el: '#mainContainer',

        initialize: function () {
          
        },

        switchToView: function (view) {
          view.delegateEvents();

          this.$('#contentWrapper').empty().append(view.$el);
        }

      });

      return MainContainerView;

    }
);