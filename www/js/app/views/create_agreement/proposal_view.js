/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'moment', 'parsley', 'text!templates/create_agreement/proposal_tpl.html'],

  function (Backbone, Handlebars, _, moment, parsley, scopeTemplate) {

    'use strict';

    var ProposalView = Backbone.View.extend({

      className:'clear white_background',
      attributes:{'id':'content'},

      template: Handlebars.compile(scopeTemplate),

      initialize: function (options) {
        this.userID = options.userID;
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
      },

      updateField: function(event){
        this.model.set(event.target.name, event.target.value);
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
      },
      saveAndContinue:function(event){
        event.preventDefault();
        event.stopPropagation();

        $( '.proposal_form' ).parsley( 'validate' );
        var isValid = $( '.proposal_form' ).parsley( 'isValid' );

        if (isValid) {
          this.model.set("draft", true);
          this.model.save({},{
            success:_.bind(function(model, response){
              window.location.hash = 'estimate';
            }, this)
          });
        }
      }
    });

    return ProposalView;

  }
  ); 
