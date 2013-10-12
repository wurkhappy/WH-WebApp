/*
 * Personal Account View.
 */

 define(['backbone', 'handlebars', 'text!templates/account/personal.html'],

  function (Backbone, Handlebars, personalTemplate) {

    'use strict';

    var PersonalView = Backbone.View.extend({

      className:'clear',

      attributes:{'id':'content'},

      template: Handlebars.compile(personalTemplate),

      events: {
        'blur input[type="text"]':'updateFields',
        'change input[type="file"]':'updateFile',
        "click #save-button":"save"
      },

      initialize: function () {
        this.render();
      },

      render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      },
      updateFields: function(event){
        this.model.set(event.target.name, event.target.value);
        console.log(this.model);
      },
      updateFile:function(event){
        var input = event.target;
        if (input.files && input.files[0]) {
          var that = this;
          var reader = new FileReader();
          reader.onload = function (e) {
            that.model.set(event.target.name, e.target.result);
            console.log(that.model);      
          };
          reader.readAsDataURL(input.files[0]);
        }
      },
      save:function(){
        this.model.save({},{success:function(model, response){
          console.log(model);
        }});
      }

    });

    return PersonalView;

  }
  );