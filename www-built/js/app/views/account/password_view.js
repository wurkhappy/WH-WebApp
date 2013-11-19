define(["backbone","handlebars","text!templates/account/password.html"],function(e,t,n){var r=e.View.extend({className:"clear white_background",attributes:{id:"content"},template:t.compile(n),events:{"click #submit-button":"save","blur input":"updatePassword"},initialize:function(){this.render(),this.passwords={}},render:function(){return this.$el.html(this.template()),this},save:function(e){this.passwords["new-pw"]===this.passwords["confirm-new-pw"]&&(this.model.set("newPassword",this.passwords["new-pw"]),this.model.set("currentPassword",this.passwords["current-pw"]),this.model.save({},{success:_.bind(function(e,t){this.$("input").val(""),$(".notification_container").fadeIn("slow")},this)}))},updatePassword:function(e){this.passwords[e.target.name]=e.target.value,$(".notification_container").fadeOut("fast").fadeOut("slow")}});return r});