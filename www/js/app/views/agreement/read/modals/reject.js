
define(['backbone', 'handlebars', 'text!templates/agreement/reject_tpl.html'],

  function (Backbone, Handlebars, rejectTemplate) {

    'use strict';

    var RejectModal = Backbone.View.extend({

      el: "#popup_container",

      template: Handlebars.compile(rejectTemplate),


      initialize:function(options){
        this.otherUser = options.otherUser;
        this.render();
      },
      render: function(){

        this.$el.append(this.template({
          status: this.statusType,
          otherUser: this.otherUser
        }));

        $('#overlay').fadeIn('slow');
        
      },
      events: {
        "click .close": "closeModal",
        "click #reject-button": "rejectRequest",
        "blur textarea": "addMessage"
      },
      show: function(){
        $('#overlay').fadeIn('slow');
      },
      closeModal: function(event) {
        $('#overlay').fadeOut('slow');
      },
      addMessage: function(event){
        this.message = event.target.value
      },
      rejectRequest: function(event) {
        this.model.reject(this.message, this.closeModal);

        var status;

        if (this.statusType) {
          status = this.statusType;
        } else {
          status = "";
        }

        var fadeOutModal = function () {
          $('#overlay').fadeOut('fast');
        };

        var fadeInNotification = function () {
          $(".notification_container").fadeIn("fast");
          $(".notification_text").text("Request "+status+" and email sent");
        };

        $(".notification_container").hover( function() {
          $(".notification_container").fadeOut("fast");
        });

        var triggerNotification = _.debounce(fadeInNotification, 300);

        fadeOutModal();
        triggerNotification();
      },

    });

    return RejectModal;

  }
  );