

define(['backbone', 'handlebars', 'underscore', 'marionette',
	'text!templates/agreement/edit/payment_item_tpl.html', 'views/agreement/edit/scope_item_view'],

	function (Backbone, Handlebars, _, Marionette, paymentItemTemplate, ScopeItemView) {

		'use strict';

		var PaymentEditView = Backbone.Marionette.CompositeView.extend({

			template: Handlebars.compile(paymentItemTemplate),

			itemView: ScopeItemView,
			itemViewContainer:'.scope-items-container',

			initialize:function(){
				this.collection = this.model.get("scopeItems");
			},
			events:{
				"blur .amount":"updateAmount",
				"blur .title":"updateTitle",
				"click .removeButton" : "removeMilestone",
				"keypress input" : "addScopeItem"
			},
			updateAmount:function(event){
				var amount = $(event.target).text();
				var adjAmount = (amount.substring(0,1) === '$') ? amount.substring(1) : amount;
				this.model.set("amount",adjAmount);
			},
			updateTitle:function(event){
				this.model.set("title",$(event.target).text())
			},
			removeMilestone: function(){
				this.model.collection.remove(this.model);
			},
			addScopeItem: function(event){
				if (event.keyCode == 13) {
					this.collection.add({text:event.target.value});
					event.target.value = null;
				}
			}

		});

		return PaymentEditView;

	}
	);