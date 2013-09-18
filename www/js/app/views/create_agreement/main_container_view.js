/*
 * Create Agreement Main - Create Agreement View.
 */

define(['backbone', 'handlebars'],

    function (Backbone, Handlebars, createTemplate) {

      'use strict';

      var MainContainerView = Backbone.View.extend({

        el: '#mainContainer',

        events:{
          "click #cancelAgreement" : "cancelAgreement"
        },

        cancelAgreement: function(event){
          (this.model.id) ? this.model.destroy() : window.location = "/freelancer/home";
        },
        switchToView: function(view){
          this.$('#contentWrapper').empty().append(view.delegateEvents().$el);
        }

      });

      return MainContainerView;

    }
);