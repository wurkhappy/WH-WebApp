
define(['backbone', 'handlebars', 'toastr', 'text!templates/agreement/reject_tpl.html'],

  function (Backbone, Handlebars, toastr, rejectTemplate) {

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
        event.preventDefault();
        event.stopPropagation();
        this.model.reject(this.message, _.bind(function(){this.trigger('hide')},this));

        var status;

        if (this.statusType) {
          status = this.statusType;
        } else {
          status = "";
        }

        var fadeInNotification = function () {
          toastr.success("Request "+status+" and email sent");
        };

        var triggerNotification = _.debounce(fadeInNotification, 300);

        this.trigger('hide');
        triggerNotification();
      },

    });

    return RejectModal;

  }
  );