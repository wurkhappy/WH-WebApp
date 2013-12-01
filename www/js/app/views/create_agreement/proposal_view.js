/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'backbone-validation', 'moment', 'text!templates/create_agreement/proposal_tpl.html'],

  function (Backbone, Handlebars, _, Validation, moment, scopeTemplate) {

    'use strict';

    var ProposalView = Backbone.View.extend({

      className:'clear white_background',
      attributes:{'id':'content'},

      template: Handlebars.compile(scopeTemplate),

      initialize: function (options) {
        this.userID = options.userID;
        Backbone.Validation.bind(this);
        this.render();
      },

      render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      },

      events: {
        "blur input": "updateField",
        'blur input[type="radio"]': "updateRole",
        'blur input[type="checkbox"]': "updateClauses",
        "blur textarea": "updateField",
        "click .submit-buttons" : "saveAndContinue",
        "mouseenter .create_agreement_navigation_link": "mouseEnterNavigation",
        "mouseleave .create_agreement_navigation_link": "mouseLeaveNavigation",
        "click .create_agreement_navigation_link": "showPage"
      },

      updateField: function(event){
        this.model.set(event.target.name, event.target.value);
        this.model.validate();
      },
      updateRole: function(event){
        this.model.unset("clientID");
        this.model.unset("freelancerID");
        this.model.set(event.target.value, this.userID);
        if (event.target.value == 'clientID') {
          
        };
      },
      updateClauses: function(event){
        var $element = $(event.target);
        this.model.get("clauses").add({id:$element.data('clauseid'), text:$element.data('text'), userID:this.userID});
        console.log(this.model);
      },
      saveAndContinue:function(event){
        event.preventDefault();
        event.stopPropagation();
        this.model.set("draft", true);
        this.model.save({},{
          success:_.bind(function(model, response){
            window.location.hash = 'estimate';
          }, this)
        });
      },

      showPage: function(event) {
        $(event.currentTarget).find("h2").removeClass("create_agreement_navigation_link_hover");
        event.preventDefault();
        event.stopPropagation();

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

    return ProposalView;

  }
  ); 
