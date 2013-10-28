
define(['backbone', 'handlebars', 'text!templates/agreement/read/header_tpl.html'],

  function (Backbone, Handlebars, userTemplate) {

    'use strict';

    var HeaderView = Backbone.View.extend({
      template: Handlebars.compile(userTemplate),

      render:function(){
        this.$el.html(this.template({
          model: this.model.toJSON(), 
          button1Title: "Submit Agreement",
          button2Title: "Save Draft"
        }));

        return this;
      },
      events:{
        "click #action-button2":"save",
        "click #action-button1":"submit"
      },
      save: function(){
        this.model.unset("versionID");
        this.model.set("draft", true);
        this.model.save({},{success:function(model, response){
          window.location = "/home";
        }});
      },
      submit: function(){
        this.model.set("draft", false);
        this.model.save({},{success:_.bind(function(model, response){
          var submitSuccess = function(){
            window.location = "/home"
          };
          this.model.submit(submitSuccess);
        },this)});
      }

    });

    return HeaderView;

  }
  );