/*
 * Create Agreement Main - Create Agreement View.
 */

define(['backbone', 'handlebars', 'hbs!templates/agreement/user_tpl'],

    function (Backbone, Handlebars, userTemplate) {

      'use strict';

      var UserView = Backbone.View.extend({
        template: userTemplate,

        render:function(){
          this.$el.html(this.template(window.otherUser));

          return this;
        }

      });

      return UserView;

    }
);