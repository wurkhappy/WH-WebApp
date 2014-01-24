
define(['backbone', 'handlebars', 'underscore', 'toastr', 'hbs!templates/agreement/edit/header_edit_tpl'],

  function (Backbone, Handlebars, _, toastr, userTemplate) {

    'use strict';

    var HeaderView = Backbone.View.extend({
      template: userTemplate,

      render:function(){
        this.$el.html(this.template({
          model: this.model.toJSON(), 
          button1Title: "Save Draft",
          button2Title: "Cancel Draft",
        }));

        return this;
      },
      events:{
        "click #action-button1":"debounceSave",
        "click #action-button2":"cancelAgreement",
      },

      debounceSave: function(event) {
        event.preventDefault();
        event.stopPropagation();
        var that = this;
        _.debounce( function(event){
          if(!that.model.get("draft")){
            that.model.unset("versionID");
          }
          that.model.set("draft", true);
          that.model.save({},{
            success:function(model, response){
              toastr.success("Agreement saved")

              window.location = '/agreement/v/' + model.id;

            }
          });
        }, 500, true)();
      },
      cancelAgreement: function(){
        event.preventDefault();
        event.stopPropagation();
        window.location= '';
      }

    });

    return HeaderView;

  }
  );