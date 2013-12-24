
define(['backbone', 'handlebars', 'toastr', 'hbs!templates/agreement/void_agreement'],

  function (Backbone, Handlebars, toastr, tpl) {

    'use strict';

    var VoidAgreement = Backbone.View.extend({


      template: tpl,


      initialize:function(options){
        //this.user = options.user;
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

    return VoidAgreement;

  }
  );