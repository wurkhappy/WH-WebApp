/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/create_agreement/estimate_tpl.html', 'views/create_agreement/milestone_view'],

  function (Backbone, Handlebars, _, Marionette, estimateTemplate, MilestoneView) {

    'use strict';

    var EstimateView = Backbone.Marionette.CompositeView.extend({

      className:'clear',
      attributes:{'id':'content'},

      template: Handlebars.compile(estimateTemplate),

      itemView: MilestoneView,

      initialize: function (options) {
        this.router = options.router;
      },

      events:{
        "click #addMoreButton" : "addMilestone",
        "click .submit-buttons > a" : "saveAndContinue"
      },

      initialize: function(options){
        this.router = options.router;
      },

      appendHtml: function(collectionView, itemView, index){
        itemView.$el.insertBefore(collectionView.$('#addMoreButton'));
      },

      addMilestone:function(event){
        this.collection.add({});
      },
      
      saveAndContinue:function(event){
        event.preventDefault();
        event.stopPropagation();

        this.model.save({},{
          success:_.bind(function(model, response){
            this.router.navigate('recipient', {trigger:true})
          }, this)
        });
      }

    });

    return EstimateView;

  }
  ); 
