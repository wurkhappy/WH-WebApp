/*
 * Password Account View.
 */

 define(['backbone', 'handlebars', 'toastr', 'hbs!templates/account/password'],

  function (Backbone, Handlebars, toastr, passwordTemplate) {

    'use strict';

    var PasswordView = Backbone.View.extend({

      className:'clear white_background layout_container',

      attributes:{'id':'content'},

      template: passwordTemplate,

      events: {
        "click #submit-button":"debounceSave",
        "blur input" : "updatePassword"
      },

      initialize: function () {
        this.render();
        this.passwords = {};
      },

      render: function () {
        this.$el.html(this.template());
        return this;
      },

      debounceSave: function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.save();
      },

      save:_.debounce(function(event){
        if (this.passwords["new-pw"] === this.passwords["confirm-new-pw"]) {
          this.model.set("newPassword", this.passwords["new-pw"]);
          this.model.set("currentPassword", this.passwords["current-pw"]);
          this.model.save({},{success:_.bind(function(model, response){
            this.$('input').val('');
            toastr.success('Password Updated!');
          },this)});
        }
      }, 500, true),
      updatePassword: function(event){
        this.passwords[event.target.name] = event.target.value
      }

    });

return PasswordView;
}
);