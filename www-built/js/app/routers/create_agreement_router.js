define(["backbone","models/agreement","views/create_agreement/proposal_view","views/create_agreement/main_container_view","views/create_agreement/estimate_view","views/create_agreement/recipient_view","models/user","views/create_agreement/layout"],function(e,t,n,r,i,s,o,u){var a=e.Router.extend({routes:{"":"proposal",proposal:"proposal",estimate:"estimate",review:"review",edit:"edit",send:"send"},initialize:function(){this.user=new o(window.user),this.model=new t({freelancerID:this.user.id}),this.model.get("payments").add({deposit:!0}),this.mainContainer=new r({model:this.model}),this.layout=new u({model:this.model})},proposal:function(){this.layout.switchToProposal()},estimate:function(){this.layout.switchToEstimate()},review:function(){this.layout.switchToReview()},edit:function(){this.layout.switchToEdit()},send:function(){this.layout.switchToSend()}});return a});