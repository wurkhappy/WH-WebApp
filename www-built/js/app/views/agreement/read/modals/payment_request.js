define(["backbone","handlebars","text!templates/agreement/pay_request_tpl.html","text!templates/agreement/pay_request_methods_tpl.html","text!templates/agreement/pay_request_breakout.html"],function(e,t,n,r,i){t.registerHelper("last_four_digits",function(e){if(!e)return;return e.slice(-4)});var s=e.View.extend({template:t.compile(r),initialize:function(e){this.bankAccounts=e.bankAccounts,this.listenTo(this.bankAccounts,"add",this.render),this.render()},render:function(){return this.$el.html(this.template({bankAccounts:this.bankAccounts.toJSON()})),this}}),o=e.View.extend({template:t.compile(n),breakoutTpl:t.compile(i),initialize:function(e){this.bankAccounts=e.bankAccounts,this.bankAccounts.fetch(),this.paymentMethodsView=new s({bankAccounts:this.bankAccounts}),this.render()},render:function(e){this.$el.html(this.template(_.extend({payments:this.collection.toJSON()},this.calculatePayment()))),this.$("header").html(this.paymentMethodsView.$el)},events:{"click #pay-button":"requestPayment","change #milestoneToPay":"updateView"},calculatePayment:function(){var e=this.model.get("amount"),t=e*.05,n=e-t;return{milestonePayment:e,wurkHappyFee:t,amountTotal:n}},updateView:function(e){var t=e.target.value;this.model=this.collection.get(t),this.$("#paymentBreakout").html(this.breakoutTpl(this.calculatePayment()))},requestPayment:function(e){var t=function(){$("#overlay").fadeOut("fast")},n=function(){$("#notification_container").fadeIn("fast"),$("#notification_text").text("Payment requested and email sent")};$("#notification_container").hover(function(){$("#notification_container").fadeOut("fast")});var r=_.debounce(n,300);t(),r();var i=this.$(".select_bank_account:checked").attr("value")||"";this.trigger("paymentRequested",i),this.trigger("hide")}});return o});