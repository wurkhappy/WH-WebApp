/*
 * Agreement - Independent View.
 */

define(['backbone', 'handlebars', 'text!templates/agreement/independent_tpl.html'],

    function (Backbone, Handlebars, independentTemplate) {

      'use strict';

      var IndependentView = Backbone.View.extend({
        template: Handlebars.compile(independentTemplate),

        render:function(){
          this.model = this.model;
          console.log(this.model);


          this.$el.html(this.template(window.thisUser));

          return this;
        }

      });

      return IndependentView;

    }
);