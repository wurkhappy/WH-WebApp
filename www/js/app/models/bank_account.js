define(['backbone','backbone-relational'],

	function(Backbone, Relational) {

		'use strict';

		var Account = Backbone.RelationalModel.extend({
			urlRoot:function(){
				return "/user/"+this.collection.user.id+"/bank_account";
			},
			verify: function(amounts, successCallback){
				$.ajax({
					type: "POST",
					url: this.url()+"/verify",
					contentType: "application/json",
					dataType: "json",
					data:JSON.stringify(amounts),
					success: _.bind(function(response){
						this.set("can_debit", true);
						successCallback(response);
					}, this)
				});
			},
			set: function( key, value, options ) {
				Backbone.RelationalModel.prototype.set.apply( this, arguments );

				if (typeof key === 'object') {
					if (_.has(key, "can_debit") && typeof key["can_debit"] === "string") {
						this.attributes.can_debit = key["can_debit"] === "true";
					}
				} else if (key === 'can_debit' && typeof key === "string"){
						this.attributes.can_debit = key === "true";
				}
				return this;
			}
		});

		return Account;

	}

	);