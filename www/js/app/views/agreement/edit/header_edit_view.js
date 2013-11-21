
define(['backbone', 'handlebars', 'text!templates/agreement/edit/header_edit_tpl.html'],

  function (Backbone, Handlebars, userTemplate) {

    'use strict';

    var HeaderView = Backbone.View.extend({
      template: Handlebars.compile(userTemplate),

      render:function(){
        this.$el.html(this.template({
          model: this.model.toJSON(), 
          button2Title: "Save Draft"
        }));

        return this;
      },
      events:{
        "click #action-button2":"save",
      },
      save: function(){
        if(!this.model.get("draft")) this.model.unset("versionID");
        this.model.set("draft", true);
        console.log(this.model);
        this.model.save({},{
          success:function(model, response){
          //window.location = "/home";
        }});
      }

    });

    return HeaderView;

  }
  );