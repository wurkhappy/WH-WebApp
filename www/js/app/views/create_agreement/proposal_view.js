/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'moment', 'text!templates/create_agreement/proposal_tpl.html'],

  function (Backbone, Handlebars, _, moment, scopeTemplate) {

    'use strict';

    var ProposalView = Backbone.View.extend({

      className:'clear content',
      attributes:{'id':'content'},

      template: Handlebars.compile(scopeTemplate),

      initialize: function (options) {
        this.router = options.router;
        this.userID = options.userID;
        this.render();
      },

      render: function () {
        this.$el.html(this.template());
        return this;
      },

      events: {
        "blur input": "updateField",
        'blur input[type="radio"]': "updateRole",
        "blur textarea": "updateField",
        "click .submit-buttons > a" : "saveAndContinue"
      },

      updateField: function(event){
        this.model.set(event.target.name, event.target.value)
      },
      updateRole: function(event){
        this.model.set(event.target.value, this.userID);
        if (event.target.value == 'clientID') {
          
        };
      },
      saveAndContinue:function(event){
        event.preventDefault();
        event.stopPropagation();
        this.model.set("draft", true);
        this.model.save({},{
          success:_.bind(function(model, response){
            this.router.navigate('estimate', {trigger:true})
          }, this)
        });
      }

    });

    return ProposalView;

  }
  ); 
