/*
 * Credit Card Account View.
 */

define(['backbone', 'handlebars'],

    function (Backbone, Handlebars) {

      'use strict';

      var MainContainerView = Backbone.View.extend({

        el: '#mainContainer',

        initialize: function (options) {
          this.router = options.router;
        },

        events: {
          "click .nav_menu" : "triggerNavigate"
        },

        triggerNavigate: function (event) {
          event.preventDefault();
          event.stopPropagation();

          var navigatePage = event.target.getAttribute("href");

          $(".nav_menu").removeClass("current");
          event.target.parentNode.setAttribute("class","current nav_menu sub_navigation_tab");

          this.router.navigate(navigatePage, {trigger:true});

        },

        switchToView: function (view) {
          view.delegateEvents();

          this.$('#contentWrapper').empty().append(view.$el);
        }

      });

      return MainContainerView;

    }
);