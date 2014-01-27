
define(['backbone', 'handlebars', 'hbs!templates/agreement/tasks_header_tpl'],

  function (Backbone, Handlebars, workItemHeaderTpl) {

    'use strict';

    var WorkItemHeaderView = Backbone.View.extend({

      template: workItemHeaderTpl,

      initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.render();
      },

      render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      },

      events: {
        "click .js_save_description": "saveDescription",
        //"keypress .work_item_description": "saveDescriptionOnEnter",
        "mousedown .js_show_description_input":"showDescriptionInput",
        "click .js_close_description_input": "closeDescriptionInput",
      },

      showDescriptionInput: function(event) {
        $(event.target).parent().attr('class', 'work_item_description_container_focus');
      },

      closeDescriptionInput: function(event) {
        event.preventDefault();
        $(event.target).parent().parent().attr('class', 'work_item_description_container');
      },

      // Allowing enter in a textarea is good karma
      /*saveDescriptionOnEnter: function(event) {
        if (event.keyCode == 13) {
          event.preventDefault();
          this.model.set({description:event.target.value});
          event.target.value = null;
          //close input
          $(event.target).parent().attr('class', 'work_item_description_container');
        }
      },*/

      saveDescription: function(event) {
        event.preventDefault();

        var $text = $(event.target).parent().prev('.work_item_description');

        if ($text !== '') {
          this.model.set({description:$text.val()});
          //close input
          $(event.target).parent().parent().attr('class', 'work_item_description_container gutter');
          $text.val(null);
          this.model.save();
        }

      }

    });

    return WorkItemHeaderView;

  }
  );