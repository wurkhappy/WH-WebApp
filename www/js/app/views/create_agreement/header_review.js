define(['backbone', 'handlebars', 'text!templates/create_agreement/header_review.html'],

  function (Backbone, Handlebars, tpl) {

    'use strict';

    var HeaderCancel = Backbone.View.extend({
      template: Handlebars.compile(tpl),
      events: {
        "click #submitAgreement" : "submitAgreement"
      },
      initialize:function(){
        this.render();
      },
      render: function(){
        this.$el.html(this.template());
        return this;
      },
      submitAgreement: function(event){
        //show submit modal
      }

    });

    return HeaderCancel;

  }
  );