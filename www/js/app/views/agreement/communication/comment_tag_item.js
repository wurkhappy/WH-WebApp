/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'marionette',
  'hbs!templates/agreement/communication/comment_tag_item'],

  function (Backbone, Handlebars, _, Marionette, tpl) {

    'use strict';

    var CommentTagItem = Backbone.Marionette.ItemView.extend({

      template: tpl,
      className: "inline added_tag",
      attributes:{tabindex:"-1"},
      events: {
        "click": "toggleTagActive",
        "keyup": "removeTag",
      },

      initialize:function(){
        this.render();
      },
      toggleTagActive: function(event) {
        this.$el.removeClass("tag_active");

        var $elem = $(event.currentTarget);
        $elem.toggleClass("tag_active");
        $elem.focus();
      },

      removeTag: function(event) {
        event.preventDefault();
        event.stopPropagation();

        var $elem = $(event.currentTarget);

        if (event.keyCode === 8) {
          this.collection.remove(this.model);
        }
      },

    });

    return CommentTagItem;

  }
  );