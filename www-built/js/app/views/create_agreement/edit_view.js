define(["backbone","handlebars","text!templates/create_agreement/edit_tpl.html","views/agreement/edit/payments_edit_view"],function(e,t,n,r){var i=e.View.extend({template:t.compile(n),className:"clear white_background",events:{"click #saveAgreement":"saveAgreement","blur input, textarea":"updateFields"},initialize:function(){this.render(),this.originalModel=this.model,this.model=_.clone(this.model)},render:function(){this.$el.html(this.template(this.model.toJSON()));var e=new r({model:this.model});return e.render(),this.$("#payments-section").html(e.$el),this},saveAgreement:function(e){e.preventDefault(),e.stopPropagation(),this.originalModel.set(this.model.toJSON()),this.model=this.originalModel,this.model.save({},{success:function(e,t){window.location.hash="review"}})},updateFields:function(){this.model.set(event.target.name,event.target.value)}});return i});