define(["backbone","handlebars","text!templates/agreement/edit/header_edit_tpl.html"],function(e,t,n){var r=e.View.extend({template:t.compile(n),render:function(){return this.$el.html(this.template({model:this.model.toJSON(),button2Title:"Save Draft"})),this},events:{"click #action-button2":"save"},save:function(){this.model.get("draft")||this.model.unset("versionID"),this.model.set("draft",!0),this.model.save({},{success:function(e,t){window.location="/home"}})}});return r});