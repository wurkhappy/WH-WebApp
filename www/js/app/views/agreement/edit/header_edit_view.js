
define(['backbone', 'handlebars', 'toastr', 'hbs!templates/agreement/edit/header_edit_tpl'],

  function (Backbone, Handlebars, toastr, userTemplate) {

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
        if(!this.model.get("draft")){
          this.model.unset("versionID");
        }
        this.model.set("draft", true);
        this.model.save({},{
          success:_.bind(function(model, response){
            toastr.success("Agreement saved")

           window.location.hash = '';

         }, this)
        });
      }

    });

    return HeaderView;

  }
  );