define(["backbone","handlebars","text!templates/create_agreement/send_tpl.html","views/agreement/read/modals/payment_request","views/ui-modules/modal"],function(e,t,n,r,i){var s=e.View.extend({template:t.compile(n),className:"clear white_background",events:{"click #sendAgreement":"sendAgreement","blur textarea":"addMessage","blur input":"addRecipient","click #requestDeposit":"requestDeposit"},initialize:function(e){this.render(),this.message="Please take a moment to look over the details of the services provided, refund policies and payment schedule to confirm that's what you want to do and you're comfortable with the agreement.",this.user=e.user},render:function(){this.deposit=this.model.get("payments").at(0);var e;this.deposit.get("required")&&this.deposit.get("amount")>0&&(e=!0),this.$el.html(this.template({message:this.message,deposit:e}))},sendAgreement:function(e){e.preventDefault(),e.stopPropagation();if(!this.model.get("clientID")&&!this.model.get("clientEmail"))return;var t=this;this.model.save({},{success:function(e,n){$(".notification_container").fadeIn("fast");var r=function(){window.location="/home"},i=_.debounce(r,800);t.model.submit(t.message,i)}})},addRecipient:function(e){this.model.set("clientEmail",e.target.value)},addMessage:function(e){this.message=e.target.value},requestDeposit:function(e){e.preventDefault(),e.stopPropagation();if(!this.model.get("clientID")&&!this.model.get("clientEmail"))return;var t=this;this.model.save({},{success:function(e,n){if(!t.modal){var s=new r({model:t.deposit,collection:t.model.get("payments"),cards:t.user.get("cards"),bankAccounts:t.user.get("bank_accounts")});t.modal=new i({view:s}),t.listenTo(t.modal.view,"paymentRequested",t.depositRequested)}t.modal.show()}})},depositRequested:function(e){if(!this.model.get("clientID")&&!this.model.get("clientEmail"))return;var t=this;this.model.save({},{success:function(n,r){$(".notification_container").fadeIn("fast");var i=function(){console.log("callback"),t.modal.view.model.submit(e,function(){window.location="/home"})};t.model.submit(t.message,i)}})}});return s});