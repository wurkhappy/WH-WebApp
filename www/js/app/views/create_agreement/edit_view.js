define(['backbone', 'handlebars', 'ckeditor', 'ckadapter', 'hbs!templates/create_agreement/edit_tpl', 'views/agreement/edit/work_items_edit_view'],

  function (Backbone, Handlebars, CKEDITOR, ckadapter, tpl, WorkItemsView) {

    'use strict';

    var EditView = Backbone.View.extend({
      template: tpl,
      className:'clear white_background',
      events:{
        "click #saveAgreement": "debounceSaveAgreement",
        "blur input, textarea": "updateFields",
        "blur #message_editor": "message"
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
        setTimeout(_.bind(this.onRender, this),5);
        return this;
      },

      onRender: function() {
        CKEDITOR.basePath = 'https://d3kq8dzp7eezz0.cloudfront.net/css/ckeditor/';
        CKEDITOR.replace('message_editor', {
          toolbar: [
          {items: ['Bold','-', 'Italic', '-', 'Underline']}
          ],
          disableNativeSpellChecker: false,
          language: 'https://d3kq8dzp7eezz0.cloudfront.net/css-1/en.js',
          skin: 'wurkhappy,https://d3kq8dzp7eezz0.cloudfront.net/css-1/wurkhappy/',
          customConfig : 'https://d3kq8dzp7eezz0.cloudfront.net/css-1/config.js'
        });
        CKEDITOR.config.contentsCss = 'https://d3kq8dzp7eezz0.cloudfront.net/css-1/contents.css' ;
        CKEDITOR.config.stylesSet = 'my_styles:https://d3kq8dzp7eezz0.cloudfront.net/css-1/styles.js';
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
        
      },
      message: function(event) {
        console.log("something here");
      }

    });

return EditView;

}
);
