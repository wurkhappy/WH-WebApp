/*
 * Personal Account View.
 */

 define(['backbone', 'handlebars', 'toastr', 'hbs!templates/account/personal', 'hbs!templates/account/profile_preview'],

  function (Backbone, Handlebars, toastr, personalTemplate, previewTemplate) {

    'use strict';

    var ProfilePreview = Backbone.View.extend({
      template: previewTemplate,

      initialize: function () {
        this.listenTo(this.model, "change", this.render);
        this.render();
      },
      render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      },
    });

    var PersonalView = Backbone.View.extend({

      className:'clear white_background',

      attributes:{'id':'content'},

      template: personalTemplate,

      events: {
        'blur input[type="text"]':'updateFields',
        'change input[type="file"]':'updateFile',
        "click #save-button":"debounceSave",
        'blur input[name="phoneNumber"]':"updatePhoneNumber"
      },

      initialize: function () {
        this.render();
      },

      render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        var preview = new ProfilePreview({model: this.model});
        this.$el.prepend(preview.$el);
        return this;
      },
      updateFields: function(event){
        this.model.set(event.target.name, event.target.value);
      },
      updateFile:function(event){
        var input = event.target;
        if (input.files && input.files[0]) {
          var that = this;
          var reader = new FileReader();
          reader.onload = function (e) {
            that.model.set(event.target.name, e.target.result);
            console.log(that.model);
            that.updateSaveButton();   
          };
          reader.readAsDataURL(input.files[0]);
        }
      },
      updatePhoneNumber: function(event){
        var number = event.target.value;
        this.model.set("phoneNumber", number.replace(/[^0-9]/g, ""));
      },

      debounceSave: function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.save();
      },

      save: _.debounce(function(event){

        $( '.account_personal_form' ).parsley( 'validate' );
        var isValid = $( '.account_personal_form' ).parsley( 'isValid' );
        if (isValid) {
          this.model.save({},{success:_.bind(function(model, response){

            toastr.success('Profile Updated!');

          }, this)});
        }       
      }, 500, true)

    });

return PersonalView;

}
);
