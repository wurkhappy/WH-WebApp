/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'text!templates/create_agreement/estimate_tpl.html'],

  function (Backbone, Handlebars, _, estimateTemplate) {

    'use strict';

    var EstimateView = Backbone.View.extend({

      className:'clear',
      attributes:{'id':'content'},

      template: Handlebars.compile(estimateTemplate),

      initialize: function (options) {
        this.router = options.router;
        this.render();
      },

      render: function () {

        this.$el.html(this.template());

        return this;

      },
      events: {
        "blur input": "updateField",
        "click .submit-buttons > a" : "saveAndContinue"
      },

      updateField: function(event){
        this.model.set(event.target.name, event.target.value)
      },
      saveAndContinue:function(event){
        event.preventDefault();
        event.stopPropagation();
        this.router.navigate('recipient', {trigger:true})

          // this.model.save({},{
          //   success:_.bind(function(model, response){
          //     this.router.navigate('estimate', {trigger:true})
          //   }, this)
          // });
  }

});

    return EstimateView;

  }
  );