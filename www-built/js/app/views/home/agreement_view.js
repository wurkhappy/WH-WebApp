define(["backbone","handlebars","underscore","text!templates/home/agreement_tpl.html"],function(e,t,n,r){var i=function(e,t){var n,r=e.get("paymentID")?"Payment":"Agreement",i=r+" "+e.get("action")+" on "+e.get("date").format("MMM D, YYYY");switch(e.get("action")){case e.StatusSubmitted:n="Waiting for "+r;break;case e.StatusCreated:n=null,i=null;break;default:n="Waiting for Current Milestone"}return{lastAction:i,currentState:n}},s=e.View.extend({tagName:"tr",template:t.compile(r),initialize:function(e){this.currentUser=e.currentUser,this.userIsClient=this.model.get("clientID")===this.currentUser.id;var t=t?this.model.get("freelancerID"):this.model.get("clientID");this.otherUser=e.otherUsers.get(t)},render:function(){var e=this.model.get("currentStatus"),t=this.model.get("payments"),n=t.getPercentComplete()*100,r=this.model.get("draft")?{lastAction:"Draft Saved",currentState:"Waiting to be submitted"}:i(e,this.userIsClient);return this.$el.html(this.template({model:this.model.toJSON(),statusInfo:r,client:this.userIsClient,otherUser:this.otherUser,percentComplete:n})),this}});return s});