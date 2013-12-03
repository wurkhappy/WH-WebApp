/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'marionette',
  'hbs!templates/agreement/communication/comment_tags', 'views/agreement/communication/comment_tag_item'],

  function (Backbone, Handlebars, _, Marionette, tpl, TagItem) {

    'use strict';

    var CommentTags = Backbone.Marionette.CompositeView.extend({

      template: tpl,
      className: "enter_tags_container float_left",

      itemView: TagItem,
      itemViewContainer: ".enter_tags_sub_container",
      itemViewOptions:function(){return{collection: this.collection}},
      events: {
        "focus .new_tag": "triggerAutoComplete",
        "keydown .new_tag": "createNewTag",
        "click .add_tag": "showTagInput"
      },
      initialize: function(options){
        this.tags = options.tags;
      },

      createNewTag: function(event) {

        var $elem = $(event.currentTarget);

        if (event.keyCode === 9) {
          event.preventDefault();
        }

        if ($elem.val() === '') {return};

        if (event.keyCode === 13 || event.keyCode === 9) {
          var id = $(event.target).data("id");
          var model = (id) ? this.collection.model.findOrCreate({id: id, name: event.target.value}) : {id: id, name: event.target.value};
          this.collection.add(model);
          model.collection = this.collection;
          $elem.val('');
          $elem.hide();
        }
      },

      showTagInput: function(event) {
        var $input = this.$(".new_tag");
        $input.show();
        $input.focus();

      },

      triggerAutoComplete: function(event) {
        var tags = [];
        this.tags.each(function(model){
          tags.push({label: model.get("name"), id:model.id});
        })

        this.$(".new_tag").autocomplete({
          source: tags,
          select: function(event, ui){
            $(event.target).data("id", ui.item.id);
          }
        });

        this.triggerAutoGrow();
      },

      triggerAutoGrow: function(event) {

        this.$('.new_tag').autoGrow({
          comfortZone: 3
        });
      }

    });

return CommentTags;

}
);