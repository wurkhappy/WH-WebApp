
define(['backbone', 'handlebars', 'text!templates/agreement/edit/header_tpl.html'],

  function (Backbone, Handlebars, userTemplate) {

    'use strict';

    var HeaderView = Backbone.View.extend({
      template: Handlebars.compile(userTemplate),

      render:function(){
        this.$el.html(this.template(this.model.toJSON()));

        return this;
      },
      events:{
        "click #save-button":"save",
        "click #submit-button":"submit"
      },
      save: function(){
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