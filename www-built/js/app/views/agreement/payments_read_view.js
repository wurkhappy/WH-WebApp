define(["backbone","handlebars","underscore","marionette","text!templates/agreement/payment_read_tpl.html","views/agreement/payment_item_view"],function(e,t,n,r,i,s){var o=e.Marionette.CompositeView.extend({template:t.compile(i),itemView:s,itemViewContainer:"ul",initialize:function(){this.collection=this.model.get("payments")},onRender:function(){this.$("#payments-total").text("$"+this.collection.getTotalAmount())},updateState:function(){var e=this.model.get("currentStatus")}});return o});