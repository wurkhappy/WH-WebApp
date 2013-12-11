
define(['backbone', 'handlebars', 'toastr', 'hbs!templates/agreement/void_agreement'],

  function (Backbone, Handlebars, toastr, tpl) {

    'use strict';

    var VoidAgreement = Backbone.View.extend({


      template: tpl,


      initialize:function(options){
        this.user = options.user;
        this.render();
      },
      render: function(){

        this.$el.html(this.template(this.model.toJSON()));        
      },
      events: {
        "click #void-button": "void",
      },
      void: function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.model.archive(this.user.id);
        var fadeInNotification = function () {
          toastr.success('Agreement Archived');
        };

        var triggerNotification = _.debounce(fadeInNotification, 300);
        this.trigger('hide');
        triggerNotification();
      },

    });

    return VoidAgreement;

  }
  );