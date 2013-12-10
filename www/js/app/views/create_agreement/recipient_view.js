/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'hbs!templates/create_agreement/send_tpl'],

  function (Backbone, Handlebars, _, recipientTemplate) {

    'use strict';

    var RecipientView = Backbone.View.extend({

      className:'clear white_background',
      attributes:{'id':'content'},

      template: recipientTemplate,

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
        "click .submit-buttons > a" : "saveAndSendAgreement",
        "mouseenter .create_agreement_navigation_link": "mouseEnterNavigation",
        "mouseleave .create_agreement_navigation_link": "mouseLeaveNavigation",
        "click .create_agreement_navigation_link": "showPage"
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
      },

      showPage: function(event) {
        $(event.currentTarget).find("h2").removeClass("create_agreement_navigation_link_hover");
        event.preventDefault();
        event.stopPropagation();

        var destination = $(event.currentTarget).attr('href');

        this.model.save({},{
          success:_.bind(function(model, response){
            this.router.navigate(destination, {trigger:true})
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

    return RecipientView;

  }
  );

