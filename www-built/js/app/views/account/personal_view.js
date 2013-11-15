define(["backbone","handlebars","text!templates/account/personal.html","text!templates/account/profile_preview.html"],function(e,t,n,r){t.registerHelper("phoneFormat",function(e){if(!e)return;var t=e.substring(0,3),n=e.substring(3,6),r=e.substring(6,10);return"("+t+") "+n+"-"+r});var i=e.View.extend({template:t.compile(r),initialize:function(){this.listenTo(this.model,"change",this.render),this.render()},render:function(){return this.$el.html(this.template(this.model.toJSON())),this}}),s=e.View.extend({className:"clear white_background",attributes:{id:"content"},template:t.compile(n),events:{'blur input[type="text"]':"updateFields",'change input[type="file"]':"updateFile","click #save-button":"save",'blur input[name="phoneNumber"]':"updatePhoneNumber"},initialize:function(){this.render()},render:function(){this.$el.html(this.template(this.model.toJSON()));var e=new i({model:this.model});return this.$el.prepend(e.$el),this},updateFields:function(e){this.model.set(e.target.name,e.target.value),this.updatenotification()},updateFile:function(e){var t=e.target;if(t.files&&t.files[0]){var n=this,r=new FileReader;r.onload=function(t){n.model.set(e.target.name,t.target.result),console.log(n.model),n.updateSaveButton()},r.readAsDataURL(t.files[0])}},updatePhoneNumber:function(e){var t=e.target.value;this.model.set("phoneNumber",t.replace(/[^0-9]/g,""))},updatenotification:function(e){$(".notification_container").fadeOut("slow")},save:function(){$(".account_personal_form").parsley("validate");var e=$(".account_personal_form").parsley("isValid");e&&this.model.save({},{success:_.bind(function(e,t){$(".notification_container").fadeOut("fast").fadeIn("slow")},this)})}});return s});