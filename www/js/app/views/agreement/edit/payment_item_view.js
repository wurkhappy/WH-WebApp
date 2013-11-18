

define(['backbone', 'handlebars', 'underscore', 'marionette',
	'text!templates/agreement/edit/payment_item_tpl.html', 'views/agreement/edit/scope_item_view'],

	function (Backbone, Handlebars, _, Marionette, paymentItemTemplate, ScopeItemView) {

		'use strict';

		var PaymentEditView = Backbone.Marionette.CompositeView.extend({

			template: Handlebars.compile(paymentItemTemplate),

			itemView: ScopeItemView,
			itemViewContainer:'.scope_items_container',

			initialize:function(){
				this.collection = this.model.get("scopeItems");
			},
			events:{
				"blur .amount":"updateAmount",
				"blur .title":"updateTitle",
				"click .removeButton" : "removeMilestone",
				"keypress .edit_work_item" : "addScopeItem",
				"click .add_comment": "addComment",
				"focus input": "fadeError"
			},
			updateAmount:function(event){
				var amount = event.target.value;
				console.log(amount);
				var adjAmount = (amount.substring(0,1) === '$') ? amount.substring(1) : amount;
				console.log(adjAmount);
				this.model.set("amount",adjAmount);
			},
			updateTitle:function(event){
				this.model.set("title",event.target.value)
			},
			removeMilestone: function(){
				this.model.collection.remove(this.model);
			},
			addScopeItem: function(event){
				if (event.keyCode == 13) {
					this.collection.add({text:event.target.value});
					event.target.value = null;
				}
			},
			addComment: function(event) {
		        var $text = $(event.target).prev('.add_work_item_input'),
		            $input = $('input'),
		            $error = $(event.target).next('.add_work_item_error');

		        if ($text.val() === '') {
		          $error.fadeIn('fast');
		          $input.keypress( function() {
		            $('.add_work_item_error').fadeOut('fast');
		          });
		          $text.focus();

		        } else {
		          this.collection.add({text:$text.val()});
		          $text.val(null);
		          $text.focus();
		        }
		    },
			fadeError: function(event) {
		        $('.add_work_item_error').fadeOut('fast');
		    }

		});

		return PaymentEditView;

	}
	);