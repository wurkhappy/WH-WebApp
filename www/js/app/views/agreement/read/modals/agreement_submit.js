
define(['backbone', 'handlebars', 'text!templates/agreement/agreement_submit_modal.html'],

  function (Backbone, Handlebars, tpl) {

    'use strict';

    var AgreementSubmit = Backbone.View.extend({


      template: Handlebars.compile(tpl),


      initialize:function(options){
        this.render();
      },
      render: function(){

        this.$el.html(this.template(this.model.toJSON()));        
      },
      events: {
        "click #reject-button": "submit",
        "blur textarea": "addMessage",
        "blur input": "addRecipient"
      },
      addRecipient: function(event){
        this.model.set("clientEmail", event.target.value);
      },
      addMessage: function(event){
        this.message = event.target.value
      },
      submit: function(event) {
        if (!this.model.get("clientID") && !this.model.get("clientEmail")) return;
        this.model.submit(this.message, _.bind(function(){this.trigger('hide')},this));

        var fadeInNotification = function () {
          $(".notification_container").fadeIn("fast");
          $(".notification_text").text("Agreement submitted and email sent");
        };

        $(".notification_container").hover( function() {
          $(".notification_container").fadeOut("fast");
        });

        var triggerNotification = _.debounce(fadeInNotification, 300);

        this.trigger('hide');
        triggerNotification();
      },

    });

    return AgreementSubmit;

  }
  );