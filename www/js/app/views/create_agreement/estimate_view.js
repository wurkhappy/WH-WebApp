/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/create_agreement/estimate_tpl.html', 'views/create_agreement/milestone_view'],

  function (Backbone, Handlebars, _, Marionette, estimateTemplate, MilestoneView) {

    'use strict';

    var EstimateView = Backbone.Marionette.CompositeView.extend({

      className:'clear white_background',
      attributes:{'id':'content'},

      template: Handlebars.compile(estimateTemplate),

      itemView: MilestoneView,

      initialize: function (options) {
        this.router = options.router;
        
      },

      events:{
        "click #addMoreButton" : "addMilestone",
        "click .submit-buttons > a" : "saveAndContinue",
        "mouseenter .create_agreement_navigation_link": "mouseEnterNavigation",
        "mouseleave .create_agreement_navigation_link": "mouseLeaveNavigation",
        "click .create_agreement_navigation_link": "showPage"
      },
      appendHtml: function(collectionView, itemView, index){
        itemView.$el.insertBefore(collectionView.$('#addMoreButton'));
      },

      addMilestone:function(event){
        event.preventDefault();
        this.collection.add({});
      },
      
      saveAndContinue:function(event){
        event.preventDefault();
        event.stopPropagation();

        this.model.save({},{
          success:_.bind(function(model, response){
            window.location.hash = 'review';
          }, this)
        });
      },

      showPage: function(event) {
        event.preventDefault();
        event.stopPropagation();

        $(event.currentTarget).find("h2").removeClass("create_agreement_navigation_link_hover");

        var destination = $(event.currentTarget).attr('href');

        this.model.save({},{
          success:_.bind(function(model, response){
            window.location.hash = destination;
          }, this)
        });
      },

      mouseEnterNavigation: function (event) {
          $(event.currentTarget).find("h2").addClass("create_agreement_navigation_link_hover");
      },

      mouseLeaveNavigation: function (event) {
          $(event.currentTarget).find("h2").removeClass("create_agreement_navigation_link_hover");
      }

    });

    return EstimateView;

  }
  ); 
