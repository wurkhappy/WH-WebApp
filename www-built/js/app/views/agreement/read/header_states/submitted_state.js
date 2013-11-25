define(["backbone","handlebars","noty","noty-inline","noty-default","views/agreement/read/header_states/base_state","text!templates/agreement/accept_tpl.html","views/agreement/read/modals/reject","views/ui-modules/modal","views/agreement/read/modals/accept_payment"],function(e,t,n,r,i,s,o,u,a,f){var l=s.extend({payTemplate:t.compile(o),initialize:function(e){s.prototype.initialize.apply(this),this.button1Title=this.userIsClient?"Accept "+this.statusType:"Waiting for Response",this.button2Title=this.userIsClient?"Reject "+this.statusType:null,this.user=e.user,this.otherUser=e.otherUser},button1:function(e){if(!this.userIsClient)return;if(this.statusType==="payment"){if(!this.acceptModal){var t=new f({model:this.model.get("payments").findSubmittedPayment(),user:this.user,otherUser:this.otherUser});this.acceptModal=new a({view:t})}this.acceptModal.show()}else if(this.model.get("payments").findFirstRequiredPayment()){if(!this.depositModal){var t=new f({model:this.model.get("payments").findFirstRequiredPayment(),user:this.user,otherUser:this.otherUser});this.depositModal=new a({view:t})}this.depositModal.show()}else this.model.accept()},button2:function(e){var t=this.statusType==="payment"?this.model.get("payments").findFirstOutstandingPayment():this.model;if(!this.rejectModal){console.log("new reject");var n=new u({model:t,otherUser:this.otherUser});this.rejectModal=new a({view:n})}this.rejectModal.show()}});return l});