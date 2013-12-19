
define(['backbone', 'handlebars', 'hbs!templates/agreement/edit/header_edit_tpl'],

  function (Backbone, Handlebars, userTemplate) {

    'use strict';

    var HeaderView = Backbone.View.extend({
      template: userTemplate,

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
      save: function(event){
        event.preventDefault();
        event.stopPropagation();
        console.log(this.model.get("draft"));
        if(!this.model.get("draft")){
          console.log("unsetid")
          this.model.unset("versionID");
        }
        this.model.set("draft", true);
        this.model.save({},{
          success:_.bind(function(model, response){
           window.location.hash = '';
           console.log(model);
         }, this)
        });
      }

    });

    return HeaderView;

  }
  );