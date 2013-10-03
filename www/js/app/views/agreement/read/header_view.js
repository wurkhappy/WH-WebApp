
define(['backbone', 'handlebars', 'text!templates/agreement/read/header_tpl.html'],

  function (Backbone, Handlebars, userTemplate) {

    'use strict';

    var HeaderView = Backbone.View.extend({
      template: Handlebars.compile(userTemplate),

      render:function(){
        this.$el.html(this.template(this.model.toJSON()));

        return this;
      },
      events:{
        "click #edit-button":"edit",
        "click #submit-button":"submit"
      },
      edit: function(){
        this.checkVersion();
        window.location.hash = "edit";
      },
      checkVersion: function(){
        if (!this.model.get("draft")) {
          var version  = this.model.get("version");
          this.model.set("version", version + 1);
          this.model.unset("id");
          console.log(this.model);
        }
      }

    });

    return HeaderView;

  }
  );