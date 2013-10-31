
define(['backbone', 'handlebars', 'text!templates/agreement/reject_tpl.html'],

  function (Backbone, Handlebars, rejectTemplate) {

    'use strict';

    var RejectModal = Backbone.View.extend({


      template: Handlebars.compile(rejectTemplate),


      initialize:function(options){
        this.otherUser = options.otherUser;
        this.render();
      },
      render: function(){

        this.$el.html(this.template({
          status: this.statusType,
          otherUser: this.otherUser
        }));        
      },
      events: {
        "click #reject-button": "rejectRequest",
        "blur textarea": "addMessage"
      },
      addMessage: function(event){
        this.message = event.target.value
      },
      rejectRequest: function(event) {
        this.model.reject(this.message, _.bind(function(){this.trigger('hide')},this));

        var status;

        if (this.statusType) {
          status = this.statusType;
        } else {
          status = "";
        }

        var fadeInNotification = function () {
          $(".notification_container").fadeIn("fast");
          $(".notification_text").text("Request "+status+" and email sent");
        };

        $(".notification_container").hover( function() {
          $(".notification_container").fadeOut("fast");
        });

        var triggerNotification = _.debounce(fadeInNotification, 300);

        this.trigger('hide');
        triggerNotification();
      },

    });

    return RejectModal;

  }
  );