/*
 * Agreement - Clauses View.
 */

 define(['backbone', 'handlebars', 'text!templates/agreement/clauses_tpl.html'],

  function (Backbone, Handlebars, clausesTemplate) {

    'use strict';

    var ClausesView = Backbone.View.extend({
      template: Handlebars.compile(clausesTemplate),

      initialize:function(options){
        this.collection.each(function(model){
          var user = (model.attributes.userID === options.user.id) ? options.user.toJSON() : options.otherUser.toJSON();
          var username = (user.firstName) ? user.firstName + " " + user.lastName : user.email;
          model.attributes.text = model.attributes.text.replace(/I\ am/g,username + " is");

        })
      },
      render:function(){
        this.$el.html(this.template({clauses:this.collection.toJSON()}));

        return this;
      }

    });

    return ClausesView;

  }
  );