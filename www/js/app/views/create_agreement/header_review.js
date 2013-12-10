define(['backbone', 'handlebars', 'hbs!templates/create_agreement/header_review'],

  function (Backbone, Handlebars, tpl) {

    'use strict';

    var HeaderCancel = Backbone.View.extend({
      template: tpl,
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