define(["backbone","handlebars","text!templates/create_agreement/review_tpl.html","views/agreement/payments_read_view","views/agreement/read/modals/agreement_submit","views/ui-modules/modal"],function(e,t,n,r,i,s){var o=e.View.extend({template:t.compile(n),className:"clear white_background review_container",events:{"click #submitAgreement":"continue"},initialize:function(){this.render()},render:function(){this.$el.html(this.template(this.model.toJSON()));var e=new r({model:this.model});return e.render(),this.$("#payments-section").html(e.$el),this},"continue":function(e){e.preventDefault(),e.stopPropagation(),window.location.hash="#send"}});return o});