/*
 * Personal Account View.
 */

 define(['backbone', 'handlebars', 'text!templates/account/personal.html', 'text!templates/account/profile_preview.html'],

  function (Backbone, Handlebars, personalTemplate, previewTemplate) {

    'use strict';
    Handlebars.registerHelper('phoneFormat', function(number) {
      if (!number) return;
      var areaCode = number.substring(0,3);
      var firstChunk = number.substring(3,6);
      var secondChunk = number.substring(6,10);
      return "("+areaCode +") "+firstChunk+"-"+secondChunk;
    });

    var ProfilePreview = Backbone.View.extend({
      template: Handlebars.compile(previewTemplate),

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

      className:'clear content',

      attributes:{'id':'content'},

      template: Handlebars.compile(personalTemplate),

      events: {
        'blur input[type="text"]':'updateFields',
        'change input[type="file"]':'updateFile',
        "click #save-button":"save",
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
        this.updateSaveButton();   
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
      updateSaveButton: function(event){
        this.$('#save-button').css('background-color', "#be3557").text('Save Personal Details');
      },
      save:function(){
        this.model.save({},{success:_.bind(function(model, response){
          $(".notification_container").fadeOut("fast").fadeIn("slow");
        }, this)});
      }

    });

return PersonalView;

}
);