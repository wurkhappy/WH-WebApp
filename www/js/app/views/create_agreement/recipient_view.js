/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'text!templates/create_agreement/recipient_tpl.html'],

  function (Backbone, Handlebars, _, recipientTemplate) {

    'use strict';

    var RecipientView = Backbone.View.extend({

      className:'clear',
      attributes:{'id':'content'},

      template: Handlebars.compile(recipientTemplate),

      initialize: function (options) {
        this.router = options.router;
        this.render();
      },

      render: function () {

        this.$el.html(this.template());

        return this;

      },
      events: {
        "blur input, textarea": "updateField",
        "click .submit-buttons > a" : "saveAndContinue"
      },

      updateField: function(event){
        this.model.set(event.target.name, event.target.value)
      },
      
      saveAndContinue:function(event){
        event.preventDefault();
        event.stopPropagation();
        this.model.set("draft", false)
        this.model.save({},{success:_.bind(function(model, response){
          var submitSuccess = function(){
            window.location = "/home"
          };
          this.model.submit(submitSuccess);
        },this)});
      }

    });

    return RecipientView;

  }
  );

