
define(['backbone', 'handlebars', 'underscore', 'marionette', 'moment',
  'text!templates/agreement/status_item_tpl.html', 'views/agreement/comment_view'],

  function (Backbone, Handlebars, _, Marionette, moment, statusTemplate, CommentView) {

    'use strict';

    var StatusView = Backbone.Marionette.CompositeView.extend({

      template: Handlebars.compile(statusTemplate),
      tagName:'li',

      itemView: CommentView,
      itemViewContainer:'.comments-container',
      events:{
        'keypress input':'addComment'
      },

      initialize:function(){
        this.collection = this.model.get("comments");
      },

      addComment:function(event){
        if (event.keyCode == 13) {
          var model = new this.collection.model({text:event.target.value, dateCreated: moment(), authorID:window.thisUser.id})
          this.collection.add(model);
          this.model.save();
          event.target.value = null;
        }
      }

    });

    return StatusView;

  }
  );