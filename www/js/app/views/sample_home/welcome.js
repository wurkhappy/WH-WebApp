
define(['backbone', 'handlebars', 'toastr', 'hbs!templates/sample_home/welcome'],

  function (Backbone, Handlebars, toastr, tpl) {

    'use strict';

    var WelcomeModal = Backbone.View.extend({


      template: tpl,


      initialize:function(options){
        this.render();
      },
      render: function(){

        this.$el.html(this.template());        
      },
      events: {
        "click #void-button": "void",
      },
      void: function(event) {
        event.preventDefault();
        event.stopPropagation();
      },

    });

    return WelcomeModal;

  }
  );