define(['backbone', 'handlebars', 'hbs!templates/create_agreement/edit_tpl', 'views/agreement/edit/work_items_edit_view'],

  function (Backbone, Handlebars, tpl, WorkItemsView) {

    'use strict';

    var EditView = Backbone.View.extend({
      template: tpl,
      className:'clear white_background',
      events:{
        "click #saveAgreement": "debounceSaveAgreement",
        "blur input, textarea": "updateFields"
      },
      initialize:function(){
        this.render();
        this.originalModel = this.model;
        this.model = _.clone(this.model);
      },
      render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        var workItemsView = new WorkItemsView({model: this.model});
        workItemsView.render();
        this.$('#work-items-section').html(workItemsView.$el);
        return this;
      },

      debounceSaveAgreement: function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.saveAgreement();
      },
      saveAgreement: _.debounce(function(event){
        this.originalModel.set(this.model.toJSON());
        this.model = this.originalModel;
        this.model.save({},{success:function(model, response){
          window.location.hash = 'review';
        }});
      }, 500, true),
      updateFields: function(){
        if (event.target.name === 'dateExpected') { return};
        this.model.set(event.target.name, event.target.value);
        
      }

    });

return EditView;

}
);