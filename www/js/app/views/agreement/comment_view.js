
define(['backbone', 'handlebars', 'text!templates/agreement/comment_tpl.html'],

  function (Backbone, Handlebars, commentTpl) {

    'use strict';

    var CommentView = Backbone.View.extend({

      template: Handlebars.compile(commentTpl),

      render: function () {
        this.$el.html(this.template(this.model.toJSON()));

        return this;

      }

    });

    return CommentView;

  }
  );