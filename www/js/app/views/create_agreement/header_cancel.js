define(['backbone', 'handlebars', 'text!templates/create_agreement/header_cancel.html'],

  function (Backbone, Handlebars, tpl) {

    'use strict';

    var HeaderCancel = Backbone.View.extend({
      template: Handlebars.compile(tpl),
      events: {
        "click #cancelAgreement" : "cancelAgreement"
      },
      initialize:function(){
        this.render();
      },
      render: function(){
        this.$el.html(this.template());
        return this;
      },
      cancelAgreement: function(event){
        (this.model.id) ? this.model.destroy({success:function(model, response){window.location = "/home";}}) : window.location = "/home";
      }

    });

    return HeaderCancel;

  }
  );