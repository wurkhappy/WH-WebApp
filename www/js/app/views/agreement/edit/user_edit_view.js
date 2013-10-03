
define(['backbone', 'handlebars', 'text!templates/agreement/edit/user_tpl.html'],

    function (Backbone, Handlebars, userTemplate) {

      'use strict';

      var UserView = Backbone.View.extend({
        template: Handlebars.compile(userTemplate),

        render:function(){
          this.$el.html(this.template(window.otherUser));

          return this;
        },
        events:{
          "blur input":"updateFields"
        },
        updateFields:function(event){
          this.model.set(event.target.name, event.target.value);
          console.log(this.model);
        }

      });

      return UserView;

    }
);