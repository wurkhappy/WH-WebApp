/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'text!templates/create_agreement/recipient_tpl.html'],

  function (Backbone, Handlebars, _, recipientTemplate) {

    'use strict';

    var RecipientView = Backbone.View.extend({

      className:'clear content',
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
        "click .submit-buttons > a" : "saveAndSendAgreement"
      },

      updateField: function(event){
        this.model.set(event.target.name, event.target.value)
      },
      
      saveAndSendAgreement:function(event){
        event.preventDefault();
        event.stopPropagation();
        this.model.set("draft", false)
        this.model.save({},{success:_.bind(function(model, response){

          $('.notification_container').fadeIn('fast');

          var changeWindow = function () {
            window.location = "/home";
          };
          var submitSuccess = _.debounce(changeWindow, 800); //delay the change in window until after success notification

          this.model.submit(this.model.get("message"), submitSuccess);
        },this)});

        

      }

    });

    return RecipientView;

  }
  );

