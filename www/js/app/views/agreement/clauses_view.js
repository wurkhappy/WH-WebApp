/*
 * Agreement - Clauses View.
 */

define(['backbone', 'handlebars', 'text!templates/agreement/clauses_tpl.html'],

    function (Backbone, Handlebars, clausesTemplate) {

      'use strict';

      var ClausesView = Backbone.View.extend({
        template: Handlebars.compile(clausesTemplate),

        render:function(){
          this.model = this.model;
          console.log(this.model);


          this.$el.html(this.template(window.thisUser));

          return this;
        }

      });

      return ClausesView;

    }
);