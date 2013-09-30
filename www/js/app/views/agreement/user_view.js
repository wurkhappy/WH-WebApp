/*
 * Create Agreement Main - Create Agreement View.
 */

define(['backbone', 'handlebars', 'text!templates/agreement/user_tpl.html'],

    function (Backbone, Handlebars, userTemplate) {

      'use strict';

      var UserView = Backbone.View.extend({
        template: Handlebars.compile(userTemplate),

        render:function(){
          this.$el.html(this.template(window.otherUser));

          return this;
        }

      });

      return UserView;

    }
);