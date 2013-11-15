define(["backbone","models/agreement","views/agreement/layout_manager","views/agreement/payments_read_view","views/agreement/agreement_history_view","views/agreement/user_view","views/agreement/edit/user_edit_view","views/agreement/edit/header_edit_view","views/agreement/edit/payments_edit_view","views/agreement/read/header_view","views/agreement/discussion_view","models/user","views/agreement/clauses_view","views/agreement/progress_bar_view"],function(e,t,n,r,i,s,o,u,a,f,l,c,h,p){var d=e.Router.extend({routes:{"":"readAgreement",edit:"editAgreement"},initialize:function(){this.model=new t(window.agreement),this.model.set("comments",window.comments),this.layout=new n({model:this.model}),this.user=new c(window.thisUser),this.otherUser=new c(window.otherUser),this.user.set("cards",window.cards),this.user.set("bank_accounts",window.bank_account)},readAgreement:function(){this.layout.agreementProgressBar.show(new p({model:this.model})),this.layout.paymentSchedule.show(new r({model:this.model})),this.layout.agreementHistory.show(new i({model:this.model})),this.layout.profile.show(new s),this.layout.header.show(new f({model:this.model,user:this.user,otherUser:this.otherUser})),this.layout.clauses.show(new h({collection:_.clone(this.model.get("clauses")),user:this.user,otherUser:this.otherUser})),this.layout.discussion.show(new l({model:this.model,user:this.user})),this.model.sample&&this.sample()},editAgreement:function(){this.layout.header.show(new u({model:this.model,user:this.user})),this.layout.paymentSchedule.show(new a({model:this.model})),this.layout.clauses.show(new h({collection:_.clone(this.model.get("clauses")),user:this.user,otherUser:this.otherUser})),this.layout.agreementHistory.show(new i({model:this.model})),this.layout.profile.show(new o({model:this.model})),this.layout.discussion.show(new l({model:this.model,user:this.user}))},sample:function(){}});return d});