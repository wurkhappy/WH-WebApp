define(["backbone","handlebars","views/agreement/read/header_states/base_state","views/agreement/read/modals/payment_request","views/ui-modules/modal"],function(e,t,n,r,i){var s=n.extend({initialize:function(e){n.prototype.initialize.apply(this),this.button1Title=this.userIsClient?null:"Request Payment",this.button2Title=this.userIsClient?null:"Edit Agreement",this.user=e.user},button1:function(e){if(!this.modal){var t=new r({model:this.model.get("payments").findFirstOutstandingPayment(),collection:this.model.get("payments").findAllOutstandingPayment(),cards:this.user.get("cards"),bankAccounts:this.user.get("bank_accounts")});this.modal=new i({view:t})}this.modal.show()},button2:function(e){this.edit()}});return s});