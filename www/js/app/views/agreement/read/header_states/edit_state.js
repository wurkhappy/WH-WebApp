
define(['backbone', 'handlebars', 'views/agreement/read/header_states/base_state'],

  function (Backbone, Handlebars, BaseState) {

    'use strict';

    var EditState = BaseState.extend({
      initialize:function(){
        BaseState.prototype.initialize.apply(this);
        this.button1Title = (this.userIsClient) ? null : "Submit Agreement"; 
        this.button2Title = (this.userIsClient) ? null : "Edit Draft"; 
      },
      button1:function(event){
        this.model.set("draft", false);
        this.model.save({},{success:_.bind(function(model, response){

          $('.notification_container').fadeIn('fast');

          var changeWindow = function () {
            window.location = "/home";
          };
          var submitSuccess = _.debounce(changeWindow, 800);

          this.model.submit(submitSuccess);
        },this)});      
      },
      button2:function(event){
        this.model.set("draft", true);
        this.model.save({},{success:function(model, response){

          var fadeOutModal = function () {
            $('#overlay').fadeOut('fast');
          };

          var fadeInNotification = function () {
            $(".notification_container").fadeIn("fast");
            $(".notification_text").text("Draft saved");
          };

          $(".notification_container").hover( function() {
            $(".notification_container").fadeOut("fast");
          });

          var triggerNotification = _.debounce(fadeInNotification, 300);

          fadeOutModal();
          triggerNotification();

          window.location = "/home";
        }});      
      },

    });

    return EditState;

  }
  );