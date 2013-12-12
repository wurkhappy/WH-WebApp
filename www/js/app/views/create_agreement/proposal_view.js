/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'moment', 'parsley', 'hbs!templates/create_agreement/proposal_tpl'],

  function (Backbone, Handlebars, _, moment, parsley, scopeTemplate) {

    'use strict';

    var ProposalView = Backbone.View.extend({

      className:'clear white_background',
      attributes:{'id':'content'},

      template: scopeTemplate,

      initialize: function (options) {
        this.userID = options.userID;
        this.render();
      },

      render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        _.defer(_.bind(this.onRender, this));
        return this;
      },

      events: {
        "blur input": "updateField",
        'blur input[type="radio"]': "updateRole",
        'blur input[type="checkbox"]': "updateClauses",
        "blur textarea": "updateField",
        "click .submit-buttons" : "saveAndContinue",
      },
      onRender: function(){
        if(this.userID === this.model.get("clientID")) this.$('input[name=role][value=clientID]').prop("checked",true);
      },
      updateField: function(event){
        console.log("field");
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
        console.log("save");
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
