

define(['backbone', 'handlebars', 'underscore', 'marionette','kalendae',
	'hbs!templates/agreement/edit/payment_item_tpl', 'views/agreement/edit/scope_item_view'],

	function (Backbone, Handlebars, _, Marionette, Kalendae, paymentItemTemplate, ScopeItemView) {

		'use strict';
		Handlebars.registerHelper('dateFormat', function(date) {
	      return date.format('MMM D, YYYY');
	    });

		var PaymentEditView = Backbone.Marionette.CompositeView.extend({

			template: paymentItemTemplate,

			itemView: ScopeItemView,
			itemViewContainer:'.scope_items_container',

			initialize:function(){
				this.collection = this.model.get("scopeItems");
			},
			events:{
				"blur .amount":"updateAmount",
				"blur .title":"updateTitle",
				"click #remove_icon" : "removeMilestone",
				"keypress .edit_work_item" : "addScopeItem",
				"click .add_comment": "addComment",
				"focus .kal": "triggerCalender",
				"focus input": "fadeError"
			},
			updateAmount:function(event){
				var amount = event.target.value;
				var adjAmount = (amount.substring(0,1) === '$') ? amount.substring(1) : amount;
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
			triggerCalender: function (event) {
		        if (!this.calendar){
		          this.calendar = new Kalendae.Input(this.$(".kal")[0], {});
		          this.calendar.subscribe('date-clicked', _.bind(this.setDate, this));
		        }
		    },
		    setDate: function(date, action){
		        this.model.set("dateExpected", date);

		         _.delay(this.closeCalendar, 150);
		         this.$('.kal').val(date.format('MM/DD/YYYY'));
		         this.$('.kal').blur();

		    },
		    closeCalendar: function() {
		        $('.kalendae').hide();
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